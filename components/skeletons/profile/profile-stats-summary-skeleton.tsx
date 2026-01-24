import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock } from "lucide-react";

export function ProfileStatsSummarySkeleton() {
  return (
    <div className="mt-4 flex w-fit flex-row items-center justify-between gap-8 rounded-lg border p-4">
      {/* Skeleton for reading time */ }
      <div className="flex items-center gap-4 px-4">
        <Clock className="h-6 w-6 text-muted-foreground"/>
        <div>
          <Skeleton className="h-7 w-16"/>
          <Skeleton className="mt-1 h-5 w-24"/>
        </div>
      </div>
      {/* Skeleton for pages read */ }
      <div className="flex items-center gap-4 px-4">
        <BookOpen className="h-6 w-6 text-muted-foreground"/>
        <div>
          <Skeleton className="h-7 w-20"/>
          <Skeleton className="mt-1 h-5 w-20"/>
        </div>
      </div>
    </div>
  );
}