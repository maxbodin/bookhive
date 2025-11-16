import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  startContent?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ( { className, type, startContent, ...props }, ref ) => {
    return (
      <div className={ cn( "relative flex items-center", className ) }>
        { startContent && (
          <div className="absolute left-3 flex items-center pointer-events-none">
            { startContent }
          </div>
        ) }
        <input
          type={ type }
          className={ cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            startContent ? "pl-10" : "pl-3"
          ) }
          ref={ ref }
          { ...props }
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
