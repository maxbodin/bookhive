import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React, { ViewTransition } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import ReadingLogger from "@/components/sessions/reading-logger";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist( { variable: "--font-geist-sans", subsets: ["latin"] } );
const geistMono = Geist_Mono( { variable: "--font-geist-mono", subsets: ["latin"] } );

// Generate dynamic, translated metadata.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations( "Layout" );
  return { title: t( "title" ), description: t( "description" ) };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout( { children }: Readonly<{ children: React.ReactNode }> ) {
  const messages = useMessages();

  return (
    <html suppressHydrationWarning>
    <body className={ `${ geistSans.variable } ${ geistMono.variable } antialiased` }>
    <NextIntlClientProvider messages={ messages }>
      <Toaster/>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ViewTransition name="navbar">
          <Navbar/>
        </ViewTransition>

        <ViewTransition>
          { children }
        </ViewTransition>

        <ReadingLogger/>

        <ViewTransition name="footer" update="none">
          <Footer/>
        </ViewTransition>
        <Analytics/>
      </ThemeProvider>
    </NextIntlClientProvider>
    </body>
    </html>
  );
}