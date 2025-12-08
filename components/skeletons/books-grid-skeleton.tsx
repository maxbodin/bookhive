import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton component for the books grid.
 * @constructor
 */
export function BooksGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-4 p-4">
      { Array.from( { length: 21 } ).map( ( _, index ) => (
        <div key={ index } className="flex flex-col space-y-3">
          <Skeleton className="w-full h-auto aspect-[2/3] rounded-t-lg"/>
          <div className="space-y-2">
            <Skeleton className="h-4 w-5/6"/>
            <Skeleton className="h-4 w-3/5"/>
          </div>
        </div>
      ) ) }
    </div>
  );
}