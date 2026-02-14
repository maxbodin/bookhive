import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton component for authentication buttons.
 * @constructor
 */
export function AuthButtonsSkeleton() {
  return (
    <div className="flex items-center gap-4">
      {/* Skeleton for Username */ }
      <Skeleton className="hidden h-9 w-24 md:block"/>
      {/* Skeleton for Sign out/Sign in button */ }
      <Skeleton className="h-9 w-20"/>
    </div>
  );
}