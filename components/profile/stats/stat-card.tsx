import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function StatCard( { title, children }: StatCardProps ) {
  return (
    <Card className={ "flex flex-col rounded-lg max-w-md" }>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          { title }
        </CardTitle>
      </CardHeader>
      <CardContent>{ children }</CardContent>
    </Card>
  );
}