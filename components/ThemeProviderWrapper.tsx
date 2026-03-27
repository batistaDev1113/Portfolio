'use client';
import React from 'react';
import { LazyMotion } from 'framer-motion';
import MyThemeProvider from './ThemeProvider';
import { RootLayoutProps } from '../app/layout';

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
