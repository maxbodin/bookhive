import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  startContent?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ( { className, type, startContent, ...props }, ref ) => {
    const baseStyles = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

    if (startContent) {
      return (
        <div className={ cn( "relative flex items-center w-full", className ) }>
          <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
            { startContent }
          </div>
          <input
            type={ type }
            className={ cn( baseStyles, "pl-10" ) }
            ref={ ref }
            { ...props }
          />
        </div>
      );
    }

    return (
      <input
        type={ type }
        className={ cn( baseStyles, className ) }
        ref={ ref }
        { ...props }
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
