// Type: Layout
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import ResumeChatbot from '../components/ResumeChatbot';
import ThemeProvider from '../components/ThemeProvider';
import './styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400'],
});

type MetadataProps = Metadata;

export const metadata: MetadataProps = {
  metadataBase: new URL('https://www.yuniorbatista.com'),
  title: 'Yunior Batista — Senior Frontend Engineer',
  description:
    'Product-minded Senior Frontend Engineer building scalable, accessible, high-performance web apps with React, Next.js, and TypeScript.',
  alternates: {
    canonical: 'https://www.yuniorbatista.com',
  },
  openGraph: {
    title: 'Yunior Batista — Senior Frontend Engineer',
    description:
      'Product-minded Senior Frontend Engineer building accessible, high-performance web apps with React, Next.js, and TypeScript.',
    url: 'https://www.yuniorbatista.com',
    siteName: 'Yunior Batista',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-preview',
        width: 1200,
        height: 630,
        alt: 'Yunior Batista — Senior Frontend Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yunior Batista — Senior Frontend Engineer',
    description:
      'Product-minded Senior Frontend Engineer building accessible, high-performance web apps with React, Next.js, and TypeScript.',
    images: ['/og-preview'],
  },
};

export interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link
          rel='api-catalog'
          href='https://www.yuniorbatista.com/.well-known/api-catalog'
          type='application/linkset+json'
        />
        <link
          rel='describedby'
          href='https://www.yuniorbatista.com/openapi.json'
          type='application/vnd.oai.openapi+json'
        />
        <link
          rel='alternate'
          href='https://www.yuniorbatista.com/index.md'
          type='text/markdown'
          title='Markdown version'
        />
        <link
          rel='help'
          href='https://www.yuniorbatista.com/llms.txt'
          type='text/plain'
          title='LLM site description'
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Yunior Batista',
              jobTitle: 'Senior Frontend Engineer',
              url: 'https://www.yuniorbatista.com',
              description:
                'Product-minded Senior Frontend Engineer building accessible, high-performance web apps with React, Next.js, and TypeScript.',
              sameAs: [
                'https://github.com/batistaDev1113',
                'https://www.linkedin.com/in/yunior-profile/',
              ],
            }),
          }}
        />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.className}`}
      >
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded focus:bg-white focus:text-black dark:focus:bg-ink-900 dark:focus:text-white'
        >
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        <ResumeChatbot />
        <VercelAnalytics />
      </body>
    </html>
  );
};

export default RootLayout;
