import { getTranslations } from "next-intl/server";

/**
 * Renders a component to display a key-value pair of book metadata.
 * @param label
 * @param value
 * @constructor
 */
export default async function BookDetailItem( { label, value }: {
  label: string;
  value: string | number | null | undefined
} ) {

  const t = await getTranslations( "BookDetailItem" );

  return (
    <div>
      <dt className="text-sm font-medium text-muted-foreground">{ label }</dt>
      <dd className="mt-1 text-md text-primary">{ value ?? t( "undefined" ) }</dd>
    </div>
  );
}