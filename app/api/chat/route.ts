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
      const flush = (
        text: string,
        controller: TransformStreamDefaultController
      ) => {
        if (text.length > 0) {
          if (!sawAnyText) {
            sawAnyText = true;
          }
          controller.enqueue({
            type: 'text-delta',
            id: 'chat-text',
            delta: text,
          });
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
                  const endIdx = THINK_END_TAGS.map((tag) =>
                    buffer.indexOf(tag)
                  ).reduce(
                    (best, idx) =>
                      best === -1 || (idx !== -1 && idx < best) ? idx : best,
                    -1
                  );
                  if (endIdx !== -1) {
                    // Drop everything up to and including the close tag.
                    buffer = buffer.slice(
                      endIdx +
                        THINK_END_TAGS.reduce(
                          (min, tag) =>
                            buffer.startsWith(tag, endIdx) && tag.length < min
                              ? tag.length
                              : min,
                          Number.POSITIVE_INFINITY
                        )
                    );
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
          })
        ),
        ...rest,
      };
    },
  };
}

/**
 * Chat providers are interchangeable: both expose the OpenAI chat-completions
 * API, so the same @ai-sdk/openai client drives either one and no extra
 * dependency is needed.
 *
 * They differ in how they meter quota, which changes the fallback strategy:
 *   - OpenRouter meters free models per *account*, so one 429 means every
 *     candidate is exhausted and probing further only wastes requests.
 *   - Groq meters per *model* (and per minute), so a 429 on one model leaves
 *     the others usable and the loop should keep walking.
 */
type ChatProvider = {
  id: 'groq' | 'openrouter';
  baseURL: string;
  apiKey: string;
  models: readonly string[];
  quotaScope: 'account' | 'model';
  extraHeaders?: Record<string, string>;
};

// Groq: no card required, limits published per model. RPD/TPD from
// https://console.groq.com/docs/rate-limits - because quota is per model, the
// list below also multiplies daily capacity. Re-verify before editing:
//   curl -s https://api.groq.com/openai/v1/models \
//     -H "Authorization: Bearer $GROQ_API_KEY" | grep -o '"id":"[^"]*"'
// Verified 2026-11-07 against the live key: four chat models are enabled -
// allam-2-7b, gpt-oss-120b, gpt-oss-20b, qwen/qwen3.8-27b.
// llama-3.1-8b-instant has the largest published daily budget (14.4K RPD) but
// is NOT available on this key, so it is deliberately absent rather than
// pinned and left to 404 on every probe.
// Ordered strongest-first: quality matters more than the larger daily budget
// of the small model, which sits last as the capacity backstop.
const GROQ_MODELS = [
  'openai/gpt-oss-120b', // 1K RPD, 200K TPD
  'qwen/qwen3.8-27b', // 1K RPD, 200K TPD
  'openai/gpt-oss-20b', // 1K RPD, 200K TPD
  'allam-2-7b', // 7K RPD, 500K TPD - capacity backstop, most echo-prone
] as const;

// OpenRouter free models that are actually served. Re-verify before editing:
//   curl -s https://openrouter.ai/api/v1/models \
//     | jq -r '.data[].id | select(endswith(":free"))'
// Verified 2026-11-07: only 12 :free models exist, and the previous list had
// rotted (nemotron-3-super-120b-a12b, poolside/laguna-xs-2.1, z-ai/glm-5.2 all
// return 404 "no longer available"). Ordered to resist answer-echo
// hallucination: largest instruction models first, 3B-class last.
const OPENROUTER_MODELS = [
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'nvidia/nemotron-3.5-super-vl:free',
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-3.5-lightning:free', // 3B active MoE - most echo-prone
] as const;

/**
 * Groq wins when both keys are present: it is free without credits and meters
 * per model. OpenRouter stays reachable so deploying this before GROQ_API_KEY
 * exists cannot take the chatbot down.
 */
export function resolveChatProvider(): ChatProvider | null {
  if (process.env.GROQ_API_KEY) {
    return {
      id: 'groq',
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
      models: GROQ_MODELS,
      quotaScope: 'model',
    };
  }

  if (process.env.OPENROUTER_API_KEY) {
    return {
      id: 'openrouter',
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      models: OPENROUTER_MODELS,
      quotaScope: 'account',
      extraHeaders: {
        'HTTP-Referer': 'https://www.yuniorbatista.com',
        'X-Title': 'Yunior Batista Portfolio',
      },
    };
  }

  return null;
}

function chatCompletionsUrl(provider: ChatProvider): string {
  return `${provider.baseURL}/chat/completions`;
}

function chatHeaders(provider: ChatProvider): Record<string, string> {
  return {
    Authorization: `Bearer ${provider.apiKey}`,
    'Content-Type': 'application/json',
    ...provider.extraHeaders,
  };
}

type ChatModelSelection =
  | { ok: true; model: string }
  | { ok: false; reason: 'rate_limited' | 'unavailable' };

// Cache a working selection so the probe does not burn a request on every
// message. Keyed by provider: each one has its own model namespace.
const MODEL_CACHE_TTL_MS = 10 * 60_000;
let modelCache: {
  providerId: ChatProvider['id'];
  model: string;
  ts: number;
} | null = null;

/** Test hook: forget the cached selection between cases. */
export function __resetChatModelCache(): void {
  modelCache = null;
}

/**
 * Pick the first model that actually answers. Returns a typed outcome so the
 * caller can distinguish exhausted quota (429, retry tomorrow) from dead model
 * ids (503, genuinely unavailable).
 */
export async function selectChatModel(
  provider: ChatProvider
): Promise<ChatModelSelection> {
  if (
    modelCache &&
    modelCache.providerId === provider.id &&
    Date.now() - modelCache.ts < MODEL_CACHE_TTL_MS
  ) {
    return { ok: true, model: modelCache.model };
  }

  let sawRateLimit = false;

  for (const candidate of provider.models) {
    try {
      const probe = await fetch(chatCompletionsUrl(provider), {
        method: 'POST',
        headers: chatHeaders(provider),
        body: JSON.stringify({
          model: candidate,
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 1,
          stream: false,
        }),
        signal: AbortSignal.timeout(4_000),
      });

      if (probe.ok) {
        modelCache = {
          providerId: provider.id,
          model: candidate,
          ts: Date.now(),
        };
        console.log('Chat probe ok - selected:', candidate);
        return { ok: true, model: candidate };
      }

      const body = await probe.text();

      if (probe.status === 429 || probe.status === 413) {
        sawRateLimit = true;
        if (provider.quotaScope === 'account') {
          // Account-wide: every other candidate would burn a request to 429 too.
          console.warn(
            `Probe ${candidate} -> ${probe.status} (account-wide), stopping: ${body.slice(0, 150)}`
          );
          break;
        }
        // Model-scoped quota: the next model has its own budget.
        console.warn(
          `Probe ${candidate} -> ${probe.status} (model-scoped), trying next: ${body.slice(0, 150)}`
        );
        continue;
      }

      const isRetriable =
        probe.status === 404 ||
        probe.status === 400 ||
        /unavailable for free|No endpoints|not a valid model/i.test(body);
      console.warn(
        `Probe ${candidate} -> ${probe.status} ${body.slice(0, 150)} - ${isRetriable ? 'next' : 'abort'}`
      );
      if (!isRetriable) break;
    } catch (e) {
      console.warn(`Probe ${candidate} fetch error:`, e);
    }
  }

  return { ok: false, reason: sawRateLimit ? 'rate_limited' : 'unavailable' };
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests. Please try again in a minute.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const provider = resolveChatProvider();
    if (!provider) {
      return new Response(
        JSON.stringify({ error: 'Chat service not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
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

    const client = createOpenAI({
      baseURL: provider.baseURL,
      apiKey: provider.apiKey,
      headers: provider.extraHeaders,
    });

    const modelMessages = await convertToModelMessages(messages);

    const selection = await selectChatModel(provider);
    if (!selection.ok) {
      const isQuota = selection.reason === 'rate_limited';
      return new Response(
        JSON.stringify({
          error: isQuota
            ? 'Chat is at its daily capacity. Please try again tomorrow or email yuniorbatista1113@gmail.com'
            : 'All chat models temporarily unavailable. Please email yuniorbatista1113@gmail.com',
        }),
        {
          status: isQuota ? 429 : 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    const selectedModel = selection.model;

    // Cross-talk defense: keep only the current user turn. Prior assistant
    // messages are the copy source for the small free models (they echo
    // previous answers verbatim), so they are never sent to the model.
    // The resume context in the system prompt carries all durable facts.
    const lastUserIndex = modelMessages.findLastIndex((m) => m.role === 'user');
    const currentTurn =
      lastUserIndex >= 0 ? modelMessages.slice(lastUserIndex) : modelMessages;
    const trimmedMessages = currentTurn.filter((m) => m.role !== 'assistant');
    console.log(
      `Chat streaming - model:`,
      selectedModel,
      'messages:',
      trimmedMessages.length
    );
    const result = streamText({
      // Both providers expose the OpenAI-compatible chat-completions API. The
      // callable provider form targets the Responses API instead.
      model: wrapLanguageModel({
        model: client.chat(selectedModel),
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
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
