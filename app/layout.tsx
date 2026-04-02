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
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} ${inter.className}`}
      >
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        <VercelAnalytics />
      </body>
    </html>
  );
};

export default RootLayout;
