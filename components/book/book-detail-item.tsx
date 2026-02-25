import React from "react";

interface BookDetailItemProps {
  label: string;
  value: string | number | null | undefined;
  fallbackText: string;
}

/**
 * Renders a component to display a key-value pair of book metadata.
 * @param label
 * @param value
 * @param fallbackText
 * @constructor
 */
export default function BookDetailItem( { label, value, fallbackText }: BookDetailItemProps ) {
  return (
    <div>
      <dt className="text-sm font-medium text-muted-foreground">{ label }</dt>
      <dd className="mt-1 text-md text-primary">{ value || fallbackText }</dd>
    </div>
  );
}