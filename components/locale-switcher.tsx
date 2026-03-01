"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

const LOCALES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
] as const;

type LocaleCode = typeof LOCALES[number]["code"];

export default function LocaleSwitcher() {
  const t = useTranslations( "LocaleSwitcher" );
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();

  const onSelectChange = ( value: string ) => {
    const nextLocale = value as LocaleCode;
    document.cookie = `locale=${ nextLocale };path=/;max-age=31536000;SameSite=Lax`;

    startTransition( () => {
      router.refresh();
    } );
  };

  const currentLocaleConfig = LOCALES.find( ( l ) => l.code === locale ) || LOCALES[0];

  return (
    <Select
      defaultValue={ locale }
      onValueChange={ onSelectChange }
      disabled={ isPending }
    >
      <SelectTrigger
        className="w-fit gap-2 px-2"
        aria-label={ t( "label", { locale: currentLocaleConfig.label } ) }
      >
        <SelectValue asChild>
          <span role="img" aria-label={ currentLocaleConfig.label } className="text-xl">
            { currentLocaleConfig.flag }
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        { LOCALES.map( ( { code, label, flag } ) => (
          <SelectItem key={ code } value={ code } className="cursor-pointer">
            <span className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">{ flag }</span>
              <span className="text-sm font-medium">{ label }</span>
            </span>
          </SelectItem>
        ) ) }
      </SelectContent>
    </Select>
  );
}