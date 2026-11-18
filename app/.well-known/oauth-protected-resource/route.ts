import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const metadata = {
  resource: 'https://www.yuniorbatista.com',
  authorization_servers: ['https://www.yuniorbatista.com'],
  scopes_supported: [],
  bearer_methods_supported: [],
  resource_documentation: 'https://www.yuniorbatista.com/openapi.json',
  // This portfolio site does not protect APIs with OAuth 2.0 access tokens.
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
