/** @jest-environment node */

import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from '@jest/globals';

// Type-only: importing `jest` from @jest/globals would make it a local binding,
// and SWC then stops hoisting the jest.mock calls below `import` statements —
// which breaks the ESM mock for `ai`. Jest still injects the global at runtime.
declare const jest: typeof import('@jest/globals').jest;

// `ai@7` ships as ESM-only ("type": "module"), so Jest's CJS runtime cannot
// require it. These factories deliberately avoid jest.fn() — the hoisted mock
// factories run before imports are initialized, so referencing `jest` there
// would throw. None of the paths under test reach streamText anyway.
jest.mock('ai', () => ({
  streamText: () => ({
    toUIMessageStreamResponse: () => new Response('ok'),
  }),
  convertToModelMessages: async (messages: unknown) => messages,
  wrapLanguageModel: (options: unknown) => options,
}));

jest.mock('@ai-sdk/openai', () => ({
  createOpenAI: () => ({ chat: () => ({}) }),
}));

import {
  POST,
  __resetChatModelCache,
  resolveChatProvider,
  selectChatModel,
} from '../app/api/chat/route';

/**
 * Regression net for /api/chat's validation branches and model selection.
 *
 * Two live failures are locked down here:
 *   - Every probe returned 429 (free quota exhausted) and the answer was an
 *     opaque 503. Exhausted quota now reports separately from dead models.
 *   - The fallback list rotted silently. A dead id now advances instead of
 *     killing the request.
 *
 * Quota scope differs per provider and the tests pin the difference: OpenRouter
 * meters free models per account (one 429 ends the walk), Groq meters per model
 * (a 429 on one model must not abandon the others' budget).
 *
 * Everything here is fetch-mocked; no network, no credentials.
 */

const SAVED_GROQ = process.env.GROQ_API_KEY;
const SAVED_OPENROUTER = process.env.OPENROUTER_API_KEY;
const realFetch = global.fetch;

const FAKE_GROQ_KEY = 'test-fake-groq-not-real';
const FAKE_OPENROUTER_KEY = 'test-fake-openrouter-not-real';

beforeAll(() => {
  process.env.GROQ_API_KEY = FAKE_GROQ_KEY;
  delete process.env.OPENROUTER_API_KEY;
});

afterAll(() => {
  const restore = (name: string, value: string | undefined) => {
    if (value === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = value;
    }
  };
  restore('GROQ_API_KEY', SAVED_GROQ);
  restore('OPENROUTER_API_KEY', SAVED_OPENROUTER);
  global.fetch = realFetch;
});

afterEach(() => {
  // Some tests deliberately remove or switch keys; reset to the Groq default so
  // each case exercises its own branch.
  process.env.GROQ_API_KEY = FAKE_GROQ_KEY;
  delete process.env.OPENROUTER_API_KEY;
  __resetChatModelCache();
  global.fetch = realFetch;
});

// Rate limiting is keyed on x-forwarded-for; a unique IP per test keeps the
// module-level sliding window from leaking between cases.
let ipCounter = 0;
function nextIp(): string {
  ipCounter += 1;
  return `10.0.0.${ipCounter}`;
}

function buildRequest(body: unknown, ip = nextIp()): Request {
  return new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

function userMessage(text: string) {
  return {
    id: 'msg-1',
    role: 'user' as const,
    parts: [{ type: 'text' as const, text }],
  };
}

let fetchCalls = 0;
let lastFetchUrl = '';
function mockFetchStatus(status: number, body = ''): void {
  fetchCalls = 0;
  global.fetch = (async (url: string | URL) => {
    fetchCalls += 1;
    lastFetchUrl = String(url);
    return {
      ok: status >= 200 && status < 300,
      status,
      text: async () => body,
    };
  }) as unknown as typeof fetch;
}

function requireProvider() {
  const provider = resolveChatProvider();
  if (!provider) throw new Error('expected a configured provider');
  return provider;
}

describe('provider resolution', () => {
  test('prefers Groq when both keys exist', () => {
    process.env.OPENROUTER_API_KEY = FAKE_OPENROUTER_KEY;
    expect(requireProvider().id).toBe('groq');
  });

  test('falls back to OpenRouter when GROQ_API_KEY is absent', () => {
    delete process.env.GROQ_API_KEY;
    process.env.OPENROUTER_API_KEY = FAKE_OPENROUTER_KEY;
    const provider = requireProvider();
    expect(provider.id).toBe('openrouter');
    // Deployment safety: this is what keeps the chatbot up if the Groq key is
    // not configured yet in the hosting environment.
    expect(provider.baseURL).toBe('https://openrouter.ai/api/v1');
  });

  test('reports no provider when no key is configured', () => {
    delete process.env.GROQ_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    expect(resolveChatProvider()).toBeNull();
  });
});

describe('POST /api/chat validation', () => {
  test('rejects when no provider key is configured', async () => {
    delete process.env.GROQ_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    const res = await POST(buildRequest({ messages: [userMessage('hi')] }));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: 'Chat service not configured',
    });
  });

  test('rejects an empty messages array', async () => {
    const res = await POST(buildRequest({ messages: [] }));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: 'Missing messages' });
  });

  test('rejects a body with no messages field', async () => {
    const res = await POST(buildRequest({}));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: 'Missing messages' });
  });

  test('rejects a message longer than the 500 character cap', async () => {
    const res = await POST(
      buildRequest({ messages: [userMessage('x'.repeat(501))] })
    );
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: 'Invalid message length',
    });
  });

  test('rate limits the 11th request inside one window', async () => {
    const ip = nextIp();
    // Validation runs after rate limiting, so these never reach fetch.
    for (let i = 0; i < 10; i += 1) {
      const res = await POST(buildRequest({ messages: [] }, ip));
      expect(res.status).toBe(400);
    }
    const blocked = await POST(buildRequest({ messages: [] }, ip));
    expect(blocked.status).toBe(429);
    await expect(blocked.json()).resolves.toEqual({
      error: 'Too many requests. Please try again in a minute.',
    });
  });
});

describe('selectChatModel', () => {
  test('targets the provider baseURL, not a hardcoded one', async () => {
    mockFetchStatus(200, '{}');
    const provider = requireProvider();
    await selectChatModel(provider);
    expect(lastFetchUrl).toBe(
      'https://api.groq.com/openai/v1/chat/completions'
    );
  });

  test('Groq keeps walking past a 429 because quota is per model', async () => {
    mockFetchStatus(429, '{"error":{"message":"Rate limit reached"}}');
    const provider = requireProvider();

    await expect(selectChatModel(provider)).resolves.toEqual({
      ok: false,
      reason: 'rate_limited',
    });
    // Account-scoped providers stop at 1; Groq must spend all four candidates
    // because each model carries its own daily budget.
    expect(fetchCalls).toBe(4);
  });

  test('OpenRouter stops at the first 429 (account-wide quota)', async () => {
    delete process.env.GROQ_API_KEY;
    process.env.OPENROUTER_API_KEY = FAKE_OPENROUTER_KEY;
    mockFetchStatus(
      429,
      '{"error":{"message":"Rate limit exceeded: free-models-per-day"}}'
    );
    const provider = requireProvider();

    await expect(selectChatModel(provider)).resolves.toEqual({
      ok: false,
      reason: 'rate_limited',
    });
    expect(fetchCalls).toBe(1);
  });

  test('walks the whole list when every model id is dead', async () => {
    mockFetchStatus(
      404,
      '{"error":{"message":"The model does not exist or you do not have access to it."}}'
    );
    const provider = requireProvider();

    await expect(selectChatModel(provider)).resolves.toEqual({
      ok: false,
      reason: 'unavailable',
    });
    expect(fetchCalls).toBe(4);
  });

  test('returns the first working model and caches it', async () => {
    mockFetchStatus(200, '{}');
    const provider = requireProvider();

    await expect(selectChatModel(provider)).resolves.toEqual({
      ok: true,
      model: 'openai/gpt-oss-120b',
    });
    expect(fetchCalls).toBe(1);

    // A second call inside the TTL must not re-probe.
    await expect(selectChatModel(provider)).resolves.toEqual({
      ok: true,
      model: 'openai/gpt-oss-120b',
    });
    expect(fetchCalls).toBe(1);
  });

  test('does not reuse a cached model across providers', async () => {
    mockFetchStatus(200, '{}');
    await selectChatModel(requireProvider());
    expect(fetchCalls).toBe(1);

    delete process.env.GROQ_API_KEY;
    process.env.OPENROUTER_API_KEY = FAKE_OPENROUTER_KEY;
    await selectChatModel(requireProvider());

    // A second probe proves the cache was not reused: model ids are
    // provider-specific, so a cached Groq id must never reach OpenRouter.
    expect(fetchCalls).toBe(2);
  });

  test('surfaces exhausted quota as 429, not 503', async () => {
    mockFetchStatus(429, '{"error":{"message":"Rate limit reached"}}');

    const res = await POST(buildRequest({ messages: [userMessage('hi')] }));
    expect(res.status).toBe(429);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/daily capacity/i);
  });
});
