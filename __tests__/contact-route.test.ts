/** @jest-environment node */

import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';

import { POST } from '../app/api/contact/route';

/**
 * Regression net for /api/contact's request-validation branch. Captures the
 * SWC-compiled behavior so a future babel-toolchain or SWC-version pin
 * regression surfaces as a test failure here instead of a prod 500.
 *
 * Per app/api/contact/route.ts the validation chain is:
 *   1. MAILJET_API_KEY / MAILJET_SECRET_KEY env check  -> if missing: 500
 *   2. Body parsed and field-validated                 -> if any of
 *      full_name/email/textarea is missing: 400 + { error: 'Missing required fields' }
 *   3. (out of scope for this net) Mailjet API call   -> success 200 / fail 500
 *
 * Tests in this file deliberately target step 2 only \u2014 the validation branch
 * that has no external dependencies (no fetch, no Mailjet credentials) so the
 * test surface is minimal and CI-stable.
 */

const SAVED_API_KEY = process.env.MAILJET_API_KEY;
const SAVED_SECRET_KEY = process.env.MAILJET_SECRET_KEY;

beforeAll(() => {
  // Pre-set MAILJET env so the route reaches the body-validation branch
  // instead of returning 500 'Email service not configured'.
  process.env.MAILJET_API_KEY = 'test-fake-not-real';
  process.env.MAILJET_SECRET_KEY = 'test-fake-not-real';
});

afterAll(() => {
  if (SAVED_API_KEY !== undefined) process.env.MAILJET_API_KEY = SAVED_API_KEY;
  if (SAVED_SECRET_KEY !== undefined)
    process.env.MAILJET_SECRET_KEY = SAVED_SECRET_KEY;
});

const buildRequest = (body: unknown): Request =>
  new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

interface ErrorBody {
  error: string;
}

describe('POST /api/contact \u2014 field validation', () => {
  test.each([
    { label: 'full_name', body: { email: 'x@y.z', textarea: 'hi' } },
    { label: 'email', body: { full_name: 'Test User', textarea: 'hi' } },
    { label: 'textarea', body: { full_name: 'Test User', email: 'x@y.z' } },
    { label: 'all fields', body: {} },
  ])(
    'returns 400 with { error: "Missing required fields" } when $label is missing',
    async ({ body }) => {
      const response = await POST(buildRequest(body));
      expect(response.status).toBe(400);
      const result = (await response.json()) as ErrorBody;
      expect(result).toEqual({ error: 'Missing required fields' });
    }
  );
});
