import { NextRequest, NextResponse } from 'next/server';

function prefersMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader) return false;
  return /(^|,|\s)text\/markdown\b/i.test(acceptHeader);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/' && prefersMarkdown(request.headers.get('accept'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/index.md';
    const response = NextResponse.rewrite(url);
    response.headers.set('Vary', 'Accept');
    return response;
  }

  if (pathname === '/index.md') {
    const response = NextResponse.next();
    response.headers.set('Vary', 'Accept');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/index.md'],
};
