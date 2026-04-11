import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React, { ViewTransition } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import ReadingLoggerLoader from "@/components/sessions/reading-logger-loader";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist( { variable: "--font-geist-sans", subsets: [ "latin" ] } );
const geistMono = Geist_Mono( { variable: "--font-geist-mono", subsets: [ "latin" ] } );

// Generate dynamic, translated metadata.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations( "Layout" );
  return { title: t( "title" ), description: t( "description" ) };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout( { children }: Readonly<{ children: React.ReactNode }> ) {
  const [ messages, locale ] = await Promise.all( [ getMessages(), getLocale() ] );

  return (
    <html lang={ locale } suppressHydrationWarning>
    <body className={ `${ geistSans.variable } ${ geistMono.variable } antialiased min-h-screen flex flex-col` }>
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-foreground focus:shadow"
    >
      Skip to main content
    </a>
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

        <main id="main-content" className="flex-1">
          <ViewTransition>
            { children }
          </ViewTransition>
        </main>

        <ReadingLoggerLoader/>

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