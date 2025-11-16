"use client";

import { SearchParams } from "@/app/searchParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";

export default function Search( { placeholder }: { placeholder: string } ) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback( ( term: string ) => {
    const params = new URLSearchParams( searchParams );

    if (term) {
      params.set( SearchParams.QUERY, term );
    } else {
      params.delete( SearchParams.QUERY );
    }

    router.replace( `${ pathname }?${ params.toString() }` );
  }, 300 );

  return (
    <Input
      placeholder={ placeholder }
      onChange={ ( e ) => handleSearch( e.target.value ) }
      defaultValue={ searchParams.get( SearchParams.QUERY )?.toString() }
      startContent={
        <MagnifyingGlassIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400"/>
      }
    />
  );
}