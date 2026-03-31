'use client';
import { LazyMotion } from 'framer-motion';
import { RootLayoutProps } from '../app/layout';
import MyThemeProvider from './ThemeProvider';

const loadFeatures = () =>
  import('framer-motion').then((res) => res.domAnimation);

const ThemeProviderWrapper = ({ children }: RootLayoutProps) => {
  return (
    <MyThemeProvider attribute='class'>
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MyThemeProvider>
  );
};

export default ThemeProviderWrapper;
