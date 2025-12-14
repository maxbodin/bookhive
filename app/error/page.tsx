"use client";

import { useTranslations } from "next-intl";

export default function ErrorPage() {
  const t = useTranslations( "ErrorPage" );
  return <p>{ t( "message" ) }</p>;
}