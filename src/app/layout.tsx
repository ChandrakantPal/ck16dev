import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import type { ReactNode } from "react";
import CommandProvider from "@/components/command/CommandProvider";
import Header from "@/components/Header";
import { site } from "@/config/site";
import { ThemeProvider } from "next-themes";
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
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: {
    types: { "application/rss+xml": [{ url: "/feed.xml", title: "Writing" }] },
  },
};

/*
 * suppressHydrationWarning is required by next-themes: it writes the theme
 * class onto <html> before React hydrates, so the server and client markup
 * differ by design on that one attribute.
 */
const RootLayout = ({ children }: { children: ReactNode }) => (
  <html
    lang="en"
    className={robotoMono.variable}
    /* Opts into the smooth scrolling globals.css sets, which Next warns about otherwise. */
    data-scroll-behavior="smooth"
    suppressHydrationWarning
  >
    <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <CommandProvider>
          <Header />
          {children}
        </CommandProvider>
      </ThemeProvider>
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
