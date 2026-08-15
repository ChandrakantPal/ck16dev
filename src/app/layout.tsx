import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import type { ReactNode } from "react";
import CommandProvider from "@/components/command/CommandProvider";
import Header from "@/components/Header";
import "@/styles/globals.css";

/*
 * Self-hosted by Next, replacing the render-blocking third-party @import that
 * previously sat at the top of globals.css.
 */
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Chandrakant Pal — Software Engineer",
  description:
    "I'm Chandrakant Pal, a software developer who enjoys building user-centric products for the web.",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className={robotoMono.variable}>
    <body>
      <CommandProvider>
        <Header />
        {children}
      </CommandProvider>
    </body>
  </html>
);

export default RootLayout;
