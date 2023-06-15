"use client";

import "../app/styles/globals.css";
import { ThemeProvider } from "next-themes";

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
