// Type: Layout
import './styles/globals.css';
import { Montserrat } from 'next/font/google';
import { ReactNode } from 'react';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import ThemeProviderWrapper from '../components/ThemeProviderWrapper';

const montserrat = Montserrat({ subsets: ['latin'] });

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

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <body suppressHydrationWarning={true} className={montserrat.className}>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        <VercelAnalytics />
      </body>
    </html>
  );
};

export default RootLayout;
