"use client";
import React from "react";
import "../app/styles/globals.css";
import { ThemeProvider } from "next-themes";

/* Traditionally you would use a button to toggle between light and dark mode */
const MyThemeProvider = ({ children, ...props }) => {
  return (
    <ThemeProvider
      {...props}
      defaultTheme="dark"
      enableSystem={true}
      enableColorScheme={true}
    >
      {children}
    </ThemeProvider>
  );
};

export default MyThemeProvider;
