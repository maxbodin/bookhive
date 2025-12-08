import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton component for the user banner.
 * @constructor
 */
export function UserBannerSkeleton() {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
      { Array.from( { length: 10 } ).map( ( _, index ) => (
        <Skeleton key={ index } className="h-20 w-20 rounded-full flex-shrink-0"/>
      ) ) }
    </div>
  );
}