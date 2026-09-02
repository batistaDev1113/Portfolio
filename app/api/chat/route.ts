import {
  streamText,
  convertToModelMessages,
  wrapLanguageModel,
  type LanguageModelMiddleware,
  type UIMessage,
} from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { systemPrompt } from '../../../lib/resumeContext';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Simple in-memory rate limit (per-instance, resets on cold start)
// For production, replace with Upstash Ratelimit
const rateMap = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_REQ = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.ts > WINDOW_MS) {
    rateMap.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  if (entry.count > MAX_REQ) return true;
  return false;
}

// Inline chain-of-thought markers the small free models emit in plain text.
// Everything from a marker until end-of-stream (or the matching close tag)
// is internal reasoning and must never reach the recruiter UI.
const THINK_START_MARKERS = [
  '<think>',
  '<thinking>',
  "Here's a thinking process",
  'Here is a thinking process',
  'My thinking process:',
  'Thinking process:',
  'Let me analyze',
  'Let me think',
  'Let me check',
] as const;
const THINK_END_TAGS = ['</think>', '</thinking>'] as const;

/**
 * Strip inline chain-of-thought from a text stream. Buffered on text deltas
 * so a marker split across chunks is still detected; anything before a
 * marker streams through immediately.
 */
function stripInlineThinking(): LanguageModelMiddleware {
  return {
    specificationVersion: 'v4',
    wrapStream: async ({ doStream }) => {
      const { stream, ...rest } = await doStream();
      let suppress = false;
      let buffer = '';
      let sawAnyText = false;
      const markerMax = Math.max(...THINK_START_MARKERS.map((m) => m.length));
      const endTagMax = Math.max(...THINK_END_TAGS.map((t) => t.length));
      const flush = (text: string, controller: TransformStreamDefaultController) => {
        if (text.length > 0) {
          if (!sawAnyText) {
            sawAnyText = true;
          }
          controller.enqueue({ type: 'text-delta', id: 'chat-text', delta: text });
        }
      };
      return {
        stream: stream.pipeThrough(
          new TransformStream({
            transform: (chunk, controller) => {
              if (chunk.type !== 'text-delta') {
                if (chunk.type === 'text-start' || chunk.type === 'text-end') {
                  // Reasoning stays internal: never forward text lifecycle for
                  // suppressed content, and forward only one text part id.
                  if (!suppress && chunk.type === 'text-start') {
                    controller.enqueue({ type: 'text-start', id: 'chat-text' });
                  }
                  if (chunk.type === 'text-end' && !suppress) {
                    const tail = buffer;
                    buffer = '';
                    flush(tail, controller);
                    controller.enqueue({ type: 'text-end', id: 'chat-text' });
                  }
                  return;
                }
                controller.enqueue(chunk);
                return;
              }
              buffer += chunk.delta;
              // Fast path: not currently suppressing and no possible marker in
              // the buffer (last markerMax chars could still complete one).
              while (buffer.length > 0) {
                if (suppress) {
                  const endIdx = THINK_END_TAGS.map((tag) => buffer.indexOf(tag)).reduce(
                    (best, idx) => (best === -1 || (idx !== -1 && idx < best) ? idx : best),
                    -1,
                  );
                  if (endIdx !== -1) {
                    // Drop everything up to and including the close tag.
                    buffer = buffer.slice(endIdx + THINK_END_TAGS.reduce(
                      (min, tag) =>
                        buffer.startsWith(tag, endIdx) && tag.length < min ? tag.length : min,
                      Number.POSITIVE_INFINITY,
                    ));
                    suppress = false;
                    continue;
                  }
                  // Keep a tail that could still complete an end tag.
                  const keep = endTagMax - 1;
                  if (buffer.length > keep) {
                    buffer = buffer.slice(buffer.length - keep);
                  }
                  return;
                }
                const lower = buffer.toLowerCase();
                let matched: string | undefined;
                for (const marker of THINK_START_MARKERS) {
                  if (lower.includes(marker.toLowerCase())) {
                    matched = marker;
                    break;
                  }
                }
                if (matched !== undefined) {
                  const idx = lower.indexOf(matched.toLowerCase());
                  flush(buffer.slice(0, idx), controller);
                  buffer = buffer.slice(idx + matched.length);
                  suppress = true;
                  continue;
                }
                // No full marker yet; hold back a tail that could complete one.
                const safeLen = Math.max(0, buffer.length - markerMax + 1);
                if (safeLen > 0) {
                  flush(buffer.slice(0, safeLen), controller);
                  buffer = buffer.slice(safeLen);
                }
                return;
              }
            },
            flush: (controller) => {
              if (!suppress && buffer.length > 0) {
                flush(buffer, controller);
                buffer = '';
              }
            },
          }),
        ),
        ...rest,
      };
    },
  };
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again in a minute.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: 'Chat service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing messages' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Last message validation - prevent empty prompt injection
    const last = messages[messages.length - 1];
    const lastText = last.parts
      ?.filter((p) => p.type === 'text')
      .map((p) => (p as { text: string }).text)
      .join(' ')
      .trim();
    if (!lastText || lastText.length > 500) {
      return new Response(JSON.stringify({ error: 'Invalid message length' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      headers: {
        'HTTP-Referer': 'https://www.yuniorbatista.com',
        'X-Title': 'Yunior Batista Portfolio',
      },
    });

    // Live OpenRouter :free as of 2026-08-28 23:40 UTC (curl /api/v1/models | jq)
    // Ordered to resist answer-echo hallucination: lead with the largest
    // instruction models; the 3B-class lightning model is last-resort.
    const fallbackModels = [
      'google/gemma-4-31b-it:free',
      'google/gemma-4-26b-a4b-it:free',
      'nvidia/nemotron-3-super-120b-a12b:free',
      'nvidia/nemotron-3.5-lightning:free', // 3B active MoE - most echo-prone
      'poolside/laguna-xs-2.1:free',
      'z-ai/glm-5.2:free',
    ];

    const modelMessages = await convertToModelMessages(messages);

    // Probe each model with a tiny non-streaming request before committing to stream
    let selectedModel: string | null = null;
    for (const candidate of fallbackModels) {
      try {
        const probe = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://www.yuniorbatista.com',
            'X-Title': 'Yunior Batista Portfolio',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: candidate,
            messages: [{ role: 'user', content: 'ping' }],
            max_tokens: 1,
            stream: false,
          }),
          signal: AbortSignal.timeout(4_000),
        });
        if (probe.ok) {
          selectedModel = candidate;
          console.log(`Chat probe ok - selected:`, candidate);
          break;
        }
        const body = await probe.text();
        const isRetriable = probe.status === 404 || probe.status === 400 || probe.status === 429 || /unavailable for free|No endpoints|not a valid model/i.test(body);
        console.warn(`Probe ${candidate} -> ${probe.status} ${body.slice(0, 150)} - ${isRetriable ? 'next' : 'abort'}`);
        if (!isRetriable) break;
      } catch (e) {
        console.warn(`Probe ${candidate} fetch error:`, e);
      }
    }

    if (!selectedModel) {
      return new Response(JSON.stringify({ error: 'All chat models temporarily unavailable. Please email yuniorbatista1113@gmail.com' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Cross-talk defense: keep only the current user turn. Prior assistant
    // messages are the copy source for the small free models (they echo
    // previous answers verbatim), so they are never sent to the model.
    // The resume context in the system prompt carries all durable facts.
    const lastUserIndex = modelMessages.findLastIndex(
      (m) => m.role === 'user',
    );
    const currentTurn =
      lastUserIndex >= 0 ? modelMessages.slice(lastUserIndex) : modelMessages;
    const trimmedMessages = currentTurn.filter((m) => m.role !== 'assistant');
    console.log(`Chat streaming - model:`, selectedModel, 'messages:', trimmedMessages.length);
    const result = streamText({
      // OpenRouter exposes the OpenAI-compatible chat-completions API. The
      // callable provider form targets the Responses API instead.
      model: wrapLanguageModel({
        model: openrouter.chat(selectedModel),
        middleware: stripInlineThinking(),
      }),
      system: systemPrompt,
      messages: trimmedMessages,
      temperature: 0.2,
      topP: 0.9,
      maxOutputTokens: 600,
      maxRetries: 0,
      timeout: {
        totalMs: 25_000,
        firstChunkMs: 12_000,
        chunkMs: 8_000,
      },
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error(`Stream error [${selectedModel}]:`, error);
        return error instanceof Error ? error.message : String(error);
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
