import { ThemeProvider } from 'next-themes';
import { type FC, type ReactNode } from 'react';
import '../app/styles/globals.css';

interface MyThemeProviderProps {
  children: ReactNode;
  [key: string]: any;
}

const MyThemeProvider: FC<MyThemeProviderProps> = ({ children, ...props }) => {
  return (
    <ThemeProvider
      {...props}
      defaultTheme='dark'
      enableSystem={true}
      enableColorScheme={true}
    >
      {children}
    </ThemeProvider>
  );
};

export default MyThemeProvider;
