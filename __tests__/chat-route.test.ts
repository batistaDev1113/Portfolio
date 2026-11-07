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
  selectChatModel,
} from '../app/api/chat/route';

/**
 * Regression net for /api/chat's validation branches and model selection.
 *
 * The live failure this locks down: every probe returned 429
 * ("free-models-per-day"), the old loop still burned one request per candidate,
 * and the route answered 503 — which the UI rendered as an opaque "Something
 * went wrong". Selection now stops at the first 429 and reports exhausted quota
 * separately from genuinely unavailable models.
 *
 * Everything here is fetch-mocked; no network, no OpenRouter credentials.
 */

const SAVED_API_KEY = process.env.OPENROUTER_API_KEY;
const realFetch = global.fetch;

beforeAll(() => {
  process.env.OPENROUTER_API_KEY = 'test-fake-not-real';
});

afterAll(() => {
  if (SAVED_API_KEY === undefined) {
    delete process.env.OPENROUTER_API_KEY;
  } else {
    process.env.OPENROUTER_API_KEY = SAVED_API_KEY;
  }
  global.fetch = realFetch;
});

afterEach(() => {
  // Test 1 deliberately removes the key; restore it so later cases exercise
  // their own branch instead of falling into the 500 'not configured' path.
  process.env.OPENROUTER_API_KEY = 'test-fake-not-real';
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
function mockFetchStatus(status: number, body = ''): void {
  fetchCalls = 0;
  global.fetch = (async () => {
    fetchCalls += 1;
    return {
      ok: status >= 200 && status < 300,
      status,
      text: async () => body,
    };
  }) as unknown as typeof fetch;
}

describe('POST /api/chat validation', () => {
  test('rejects when OPENROUTER_API_KEY is missing', async () => {
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
  test('stops at the first 429 instead of probing every candidate', async () => {
    mockFetchStatus(
      429,
      '{"error":{"message":"Rate limit exceeded: free-models-per-day"}}'
    );

    await expect(selectChatModel()).resolves.toEqual({
      ok: false,
      reason: 'rate_limited',
    });
    // The old loop spent one request per candidate; quota exhaustion must not.
    expect(fetchCalls).toBe(1);
  });

  test('walks the whole list when every model is gone', async () => {
    mockFetchStatus(
      404,
      '{"error":{"message":"no provider serves this model anymore"}}'
    );

    await expect(selectChatModel()).resolves.toEqual({
      ok: false,
      reason: 'unavailable',
    });
    expect(fetchCalls).toBe(5);
  });

  test('returns the first working model and caches it', async () => {
    mockFetchStatus(200, '{}');

    await expect(selectChatModel()).resolves.toEqual({
      ok: true,
      model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    });
    expect(fetchCalls).toBe(1);

    // A second call inside the TTL must not re-probe.
    await expect(selectChatModel()).resolves.toEqual({
      ok: true,
      model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    });
    expect(fetchCalls).toBe(1);
  });

  test('surfaces exhausted quota as 429, not 503', async () => {
    mockFetchStatus(
      429,
      '{"error":{"message":"Rate limit exceeded: free-models-per-day"}}'
    );

    const res = await POST(buildRequest({ messages: [userMessage('hi')] }));
    expect(res.status).toBe(429);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/daily capacity/i);
  });
});
