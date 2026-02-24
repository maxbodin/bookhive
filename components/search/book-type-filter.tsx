"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SearchParams } from "@/app/utils/searchParams";
import { MultiSelect } from "@/components/ui/multi-select";

export function BookTypeFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const tBookTypes = useTranslations( "BookTypes" );
  const tNav = useTranslations( "Navbar" );

  // Read current URL state.
  const currentTypesParam = searchParams.get( SearchParams.TYPES );
  const selectedTypes = currentTypesParam ? currentTypesParam.split( "," ) : [];

  // Options configuration ("null" as string is used to represent books with no type)
  const options = [
    { label: tBookTypes( "bd" ), value: "bd" },
    { label: tBookTypes( "manga" ), value: "manga" },
    { label: tBookTypes( "roman" ), value: "roman" },
    { label: tBookTypes( "null" ), value: "null" },
  ];

  const handleSelectionChange = ( newSelection: string[] ) => {
    const params = new URLSearchParams( searchParams );

    if (newSelection.length > 0) {
      params.set( SearchParams.TYPES, newSelection.join( "," ) );
    } else {
      params.delete( SearchParams.TYPES );
    }

    // Reset pagination to page 1 whenever filters change.
    params.set( SearchParams.PAGE, "1" );

    router.replace( `${ pathname }?${ params.toString() }` );
  };

  return (
    <MultiSelect
      options={ options }
      selectedValues={ selectedTypes }
      onSelectionChange={ handleSelectionChange }
      placeholder={ tNav( "filter_type_placeholder" ) }
      className="w-[140px] md:w-[160px]"
    />
  );
}