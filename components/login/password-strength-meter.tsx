import { cn } from "@/lib/utils";
import React from "react";

interface PasswordStrengthMeterProps {
  passwordScore: number;
}

export default function PasswordStrengthMeter( {
                                                 passwordScore
                                               }: PasswordStrengthMeterProps ) {
  return <div className="space-y-2">
    <div className="flex gap-1">
      { [1, 2, 3, 4].map( ( step ) => (
        <div
          key={ step }
          className={ cn(
            "h-1 flex-1 rounded-full transition-all duration-300",
            passwordScore >= step
              ? passwordScore <= 1
                ? "bg-red-500"
                : passwordScore === 2
                  ? "bg-amber-400"
                  : passwordScore === 3
                    ? "bg-emerald-400"
                    : "bg-emerald-600"
              : "bg-muted"
          ) }
        />
      ) ) }
    </div>
    <p className="text-xs text-muted-foreground">
      { passwordScore === 0 && "Enter a password" }
      { passwordScore === 1 && "Weak password" }
      { passwordScore === 2 && "Fair password" }
      { passwordScore === 3 && "Good password" }
      { passwordScore === 4 && "Strong password" }
    </p>
  </div>;
}