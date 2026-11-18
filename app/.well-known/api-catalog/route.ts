import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const catalog = {
  linkset: [
    {
      anchor: 'https://www.yuniorbatista.com/.well-known/api-catalog',
      'service-desc': [
        {
          href: 'https://www.yuniorbatista.com/openapi.json',
          type: 'application/vnd.oai.openapi+json;version=3.1',
          title: 'Yunior Batista Portfolio APIs (OpenAPI 3.1)',
        },
      ],
      describedby: [
        {
          href: 'https://www.yuniorbatista.com/llms.txt',
          type: 'text/plain',
          title: 'LLM site description (llms.txt)',
        },
      ],
    },
  ],
  metadata: {
    title: 'Yunior Batista Portfolio API Catalog',
    description:
      'Catalog of machine-readable API descriptions and discovery resources for yuniorbatista.com.',
    publisher: 'https://www.yuniorbatista.com/',
  },
} as const;

export function GET(): NextResponse {
  return NextResponse.json(catalog, {
    headers: {
      'Content-Type': 'application/linkset+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
