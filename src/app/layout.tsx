import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
// import "@radix-ui/themes/styles.css";
import "./globals.css";
import { GeistPixelSquare } from 'geist/font/pixel';
import MiniSidebar from "@/components/fluff/MiniSidebar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | felix ha',
    default: 'Home | felix ha',
  },
  description: 'The portfolio of Felix Ha',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SmoothScroll>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${GeistPixelSquare.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Theme grayColor="gray" radius="none" panelBackground="solid" >
              <Navbar />
              <div className="flex flex-col min-h-screen relative ml-8 mb-4">
                <MiniSidebar />
                {children}
              </div>
              {/* gradient overlay footer */}
              <div className='z-0 fixed bottom-0 left-0 right-0 p-4 flex items-center justify-between bg-linear-to-t from-background to-100% to-transparent'></div>
            </Theme>
          </ThemeProvider>
        </body>
      </SmoothScroll>
    </html>
  );
}
