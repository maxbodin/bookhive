"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTransition } from "react";

/**
 * A reusable client component that navigates to the previous page in the browser's history.
 * It's designed to be used within Server Components where direct client-side routing is not possible.
 *
 * @param className
 * @param {ButtonProps} props - Accepts all standard button props for customization.
 * @param {React.ReactNode} [props.children] - Custom text or elements to display inside the button. Defaults to "Go Back".
 */
export function BackButton( { className, children, ...props }: ButtonProps ) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleBack = () => {
    startTransition( () => {
      router.back();
    } );
  };

  return (
    <Button
      variant="ghost"
      onClick={ handleBack }
      disabled={ isPending || props.disabled }
      className={ cn( "flex items-center gap-2 text-sm text-muted-foreground hover:text-primary", className ) }
      { ...props }
    >
      <ArrowLeft className="h-4 w-4"/>
      { children || "Go Back" }
    </Button>
  );
}