import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton component for authentication buttons.
 * @constructor
 */
export function AuthButtonsSkeleton() {
  return (
    <div className="flex items-center justify-end gap-4 min-w-[132px] md:min-w-[240px]">
      {/* Skeleton for Username */ }
      <Skeleton className="hidden h-9 w-28 md:block"/>
      {/* Skeleton for Sign out/Sign in button */ }
      <Skeleton className="h-9 w-24"/>
    </div>
  );
}