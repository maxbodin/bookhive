import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

/**
 * Performant utility wrapper.
 * Renders a link if isLink is true, otherwise returns a safe layout div.
 */
export default function OptionalLink( {
                                        isLink,
                                        href,
                                        className,
                                        children,
                                      }: {
  isLink: boolean;
  href: string;
  className?: string;
  children: React.ReactNode;
} ) {
  const classNames = cn( className, "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" );
  if (!isLink) {
    return <div className={ classNames }>{ children }</div>;
  }
  return (
    <Link href={ href } className={ classNames }>
      { children }
    </Link>
  );
}