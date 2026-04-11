"use client";

import dynamic from "next/dynamic";

const ReadingLogger = dynamic( () => import( "@/components/sessions/reading-logger" ), {
  ssr: false,
  loading: () => null,
} );

export default function ReadingLoggerLoader() {
  return <ReadingLogger/>;
}
