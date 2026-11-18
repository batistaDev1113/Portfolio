import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const metadata = {
  issuer: 'https://www.yuniorbatista.com',
  response_types_supported: [],
  grant_types_supported: [],
  token_endpoint_auth_methods_supported: [],
  scopes_supported: [],
  code_challenge_methods_supported: [],
  // This portfolio site does not implement OAuth 2.0 authorization/token endpoints.
  // Discovery document is published for agent/readiness metadata completeness.
} as const;

export function GET(): NextResponse {
  return NextResponse.json(metadata, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
