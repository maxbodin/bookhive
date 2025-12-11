import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  children: ReactNode;
  headerChildren?: ReactNode;
  className?: string;
}

export function StatCard( { title, children, headerChildren, className }: StatCardProps ) {
  return (
    <Card className={ `flex flex-col rounded-lg min-w-md ${ className || "" }` }>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">
          { title }
        </CardTitle>
        { headerChildren }
      </CardHeader>
      <CardContent>{ children }</CardContent>
    </Card>
  );
}