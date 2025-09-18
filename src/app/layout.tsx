import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

import PromptFooter from "@/components/prompt-footer";
import { NavigatorProvider } from "@/providers/client-navigator-context";
import { CommandProvider } from "@/providers/command-provider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Nav from "@/components/nav";
import { headers } from "next/headers"; // server-side headers
import { AppProvider } from "@/providers/app-provider";
import ScrollIntoViewComponent from "@/components/scroll-into-view-component";
import TransitionOverlay from "@/components/helpers/transition-overlay";

import localFont from "next/font/local";

export const ppEditorialNew = localFont({
  src: [
    {
      path: "../fonts/PPEditorialNew-Ultralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/PPEditorialNew-UltralightItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../fonts/PPEditorialNew-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/PPEditorialNew-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/PPEditorialNew-Ultrabold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/PPEditorialNew-UltraboldItalic.otf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-pp-editorial-new",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://felixha.com"),
  title: {
    default: "felix-ha@portfolio",
    template: "%s | felix-ha@portfolio",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the user's IP address
  let ip = (await headers()).get("x-forwarded-for") || "0.0.0.0";
  if (ip?.substring(0, 7) == "::ffff:") {
    ip = ip?.substring(7);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap&family=Anton');
        </style>
      </head>
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} ${ppEditorialNew.variable} antialiased max-h-screen min-h-screen flex flex-col`,
          false && `bg-[url(/bg-thing.svg)] bg-no-repeat bg-center bg-size-[80vw] bg-fixed`,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <div className="fixed inset-0 pointer-events-none z-[-1]">
            <div className="relative flex justify-center items-center w-full h-full">
              <Image
                src="/bg-thing.svg"
                alt="Background"
                className="w-[80vw] opacity-20"
                width={1920}
                height={1080}
                priority
              />
            </div>
          </div> */}
          <AppProvider ip={ip}>
            <CommandProvider>
              <NavigatorProvider>
                <nav className="p-2 w-full flex flex-row items-stretch gap-4 fixed pointer-events-none z-50 pb-6">
                  {/* background gradient layer, non-interactive */}
                  <div className="bg-linear-to-b from-background from-0% to-transparent absolute inset-0 pointer-events-none" />
                  <Nav />
                </nav>

                {/* <TransitionOverlay> */}
                <div className="pt-12 pb-[50px] flex flex-col grow">
                  {children}
                  <ScrollIntoViewComponent />
                </div>
                {/* </TransitionOverlay> */}

                <footer className="w-full flex flex-row gap-4 fixed z-50 bottom-0 pt-4">
                  <div className="flex w-full">
                    <PromptFooter />
                  </div>

                  {/* visual shadow */}
                  <div className="-z-1 bg-linear-to-t from-background from-0% to-transparent w-full pointer-events-none absolute inset-0" />
                </footer>
              </NavigatorProvider>
            </CommandProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
