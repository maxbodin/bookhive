import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import React from "react";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

export default function SubmitButton( {
                                        children,
                                        variant = "default",
                                        className,
                                        ...props
                                      }: SubmitButtonProps ) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={ pending }
      variant={ variant }
      className={ cn( "w-full transition-all", className ) }
      { ...props }
    >
      { pending ? <Spinner className="mr-2 h-4 w-4 animate-spin"/> : children }
    </Button>
  );
}