"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

/**
 *
 * @param code
 * @constructor
 */
function FlagIcon( { code }: { code: string } ) {
  const flags: { [key: string]: string } = {
    en: "🇬🇧",
    fr: "🇫🇷",
  };
  return <span className="mr-2">{ flags[code] }</span>;
}

export default function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();

  const onSelectChange = ( value: string ) => {
    document.cookie = `locale=${ value };path=/;max-age=31536000`; // Expires in 1 year.

    startTransition( () => {
      router.refresh();
    } );
  };

  return (
    <Select defaultValue={ locale } onValueChange={ onSelectChange } disabled={ isPending }>
      <SelectTrigger className="w-fit">
        <SelectValue asChild>
          <FlagIcon code={ locale }/>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">
          <FlagIcon code="en"/> English
        </SelectItem>
        <SelectItem value="fr">
          <FlagIcon code="fr"/> Français
        </SelectItem>
      </SelectContent>
    </Select>
  );
}