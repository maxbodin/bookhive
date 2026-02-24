"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SearchParams } from "@/app/utils/searchParams";
import { MultiSelect } from "@/components/ui/multi-select";
import { BookType } from "@/app/types/book";

const VALID_TYPES: ( BookType | "null" )[] = ["bd", "manga", "roman", "null"];

export function BookTypeFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const tBookTypes = useTranslations( "BookTypes" );
  const tNav = useTranslations( "Navbar" );

  // Read current URL state.
  const currentTypesParam = searchParams.get( SearchParams.TYPES );

  // Sanitize the selected types derived from the URL.
  const validSelectedTypes = useMemo( () => {
    if (!currentTypesParam) return [];

    return currentTypesParam
      .split( "," )
      .filter( ( type ) => VALID_TYPES.includes( type as BookType | "null" ) );
  }, [currentTypesParam] );

  // Silently correct the URL if invalid types were present.
  useEffect( () => {
    if (!currentTypesParam) return;

    const validString = validSelectedTypes.join( "," );

    // If the URL parameter doesn't match the sanitized version, an invalid type was injected.
    if (currentTypesParam !== validString) {
      const params = new URLSearchParams( searchParams );

      if (validString.length > 0) {
        params.set( SearchParams.TYPES, validString );
      } else {
        // If ALL provided types were invalid, remove the parameter entirely.
        params.delete( SearchParams.TYPES );
      }

      // Use replace so we don't pollute the user's browser history with invalid URLs.
      router.replace( `${ pathname }?${ params.toString() }` );
    }
  }, [currentTypesParam, validSelectedTypes, pathname, router, searchParams] );

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
      selectedValues={ validSelectedTypes }
      onSelectionChange={ handleSelectionChange }
      placeholder={ tNav( "filter_type_placeholder" ) }
      className="w-[140px] md:w-[160px]"
    />
  );
}