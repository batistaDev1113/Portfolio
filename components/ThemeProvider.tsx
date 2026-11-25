'use client';

import { ThemeProvider } from 'next-themes';
import type { ComponentProps } from 'react';

type MyThemeProviderProps = ComponentProps<typeof ThemeProvider>;

const MyThemeProvider = ({ children, ...props }: MyThemeProviderProps) => {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem={true}
      enableColorScheme={true}
      {...props}
    >
      {children}
    </ThemeProvider>
  );
};

export default MyThemeProvider;
