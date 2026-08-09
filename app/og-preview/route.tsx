import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Yunior Batista — Senior Frontend Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '64px 80px',
          background:
            'linear-gradient(135deg, #07090f 0%, #111623 45%, #1e1b4b 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: -1,
            display: 'flex',
            width: '100%',
          }}
        >
          Yunior Batista
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 28,
            display: 'flex',
            color: '#a5b4fc',
            letterSpacing: 2,
          }}
        >
          SENIOR FRONTEND ENGINEER
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 24,
            display: 'flex',
            color: '#cbd5e1',
            maxWidth: 800,
          }}
        >
          Building accessible, high-performance web experiences with React,
          Next.js & TypeScript.
        </div>
      </div>
    ),
    size
  );
}