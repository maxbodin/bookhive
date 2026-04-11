import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  children: ReactNode;
  headerChildren?: ReactNode;
  className?: string;
}

export function StatCard( { title, children, headerChildren, className }: StatCardProps ) {
  return (
    <Card className={ cn(
      "flex h-full flex-col rounded-xl border bg-card/80 shadow-sm",
      className
    ) }>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base md:text-lg">
          { title }
        </CardTitle>
        { headerChildren }
      </CardHeader>
      <CardContent className="flex-1">{ children }</CardContent>
    </Card>
  );
}