import { Skeleton } from "@/components/ui/skeleton";

export function AuthButtonsSkeleton() {
  return (
    <div className="flex flex-row items-center gap-2">
      {/* Skeleton for the email input field */}
      <Skeleton className="h-10 w-[150px]" />
      {/* Skeleton for the sign-in button */}
      <Skeleton className="h-10 w-[80px]" />
    </div>
  );
}