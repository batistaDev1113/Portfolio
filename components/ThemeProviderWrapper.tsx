'use client';
import { RootLayoutProps } from '../app/layout';
import MyThemeProvider from './ThemeProvider';

const ThemeProviderWrapper = ({ children }: RootLayoutProps) => {
  return <MyThemeProvider attribute='class'>{children}</MyThemeProvider>;
};

export default ThemeProviderWrapper;
