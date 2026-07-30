// Type: Layout
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import { FC, ReactNode } from 'react';
import ThemeProviderWrapper from '../components/ThemeProviderWrapper';
import './styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

type MetadataProps = {
  title: string;
  description: string;
};

export const metadata: MetadataProps = {
  title: "Yunior Batista's Portfolio",
  description: 'A portfolio to showcase some of my projects and experiences',
};

export interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='icon' href='data:,' />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} ${inter.className}`}
      >
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded focus:bg-white focus:text-black dark:focus:bg-gray-900 dark:focus:text-white'
        >
          Skip to main content
        </a>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        <VercelAnalytics />
      </body>
    </html>
  );
};

export default RootLayout;
