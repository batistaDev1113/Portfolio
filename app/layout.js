import "./globals.css";
import { Montserrat } from "next/font/google";
import MyThemeProvider from "@/components/ThemeProvider";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Yunior Batista's Portfolio",
  description: "A portfolio to showcase some of my projects and experiences",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true} className={montserrat.className}>
        <MyThemeProvider attribute="class">{children}</MyThemeProvider>
      </body>
    </html>
  );
}
