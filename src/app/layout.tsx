import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";
import "./root.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://felixha.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const description = "Felix Ha is a multidisciplinary designer and developer working across software, hardware, visual branding, and ventures.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | felix ha',
    default: 'felix ha',
  },
  description,
  keywords: ['Felix Ha', 'portfolio', 'software engineer', 'designer', 'web development', 'UI design', 'hardware'],
  authors: [{ name: 'Felix Ha', url: siteUrl }],
  creator: 'Felix Ha',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'felix ha',
    title: 'felix ha',
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'felix ha',
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${GeistPixelSquare.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
