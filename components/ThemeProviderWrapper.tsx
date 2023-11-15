"use client";
import React from "react";
import MyThemeProvider from "./ThemeProvider";
import { RootLayoutProps } from "../app/layout";

const ThemeProviderWrapper = ({ children }: RootLayoutProps) => {
  return <MyThemeProvider attribute='class'>{children}</MyThemeProvider>;
};

export default ThemeProviderWrapper;
