import { streamText, convertToModelMessages, type UIMessage } from 'ai';
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
    // User's requested 3.5-lightning is back in the list
    const fallbackModels = [
      'nvidia/nemotron-3.5-lightning:free', // primary - user's pick, 3B active MoE, 1M ctx
      'google/gemma-4-31b-it:free',
      'google/gemma-4-26b-a4b-it:free',
      'nvidia/nemotron-3-super-120b-a12b:free',
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

    // Trim history to last 4 messages to reduce cross-talk (school -> phone bleed)
    const trimmedMessages = modelMessages.slice(-4);
    console.log(`Chat streaming - model:`, selectedModel, 'messages:', trimmedMessages.length);
    const result = streamText({
      model: openrouter(selectedModel),
      system: systemPrompt,
      messages: trimmedMessages,
      temperature: 0.2,
      topP: 0.9,
      maxOutputTokens: 300,
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
