"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface YearSelectionProps {
  year: number;
  onValueChange: ( year: string ) => void;
}


export function YearSelection( { year, onValueChange }: YearSelectionProps ) {
  const t = useTranslations( "Stats.YearSelection" );
  const availableYears = [2022, 2023, 2024, 2025, 2026];

  return (
    <div className="flex items-center gap-2">
      <Select value={ String( year ) } onValueChange={ onValueChange }>
        <SelectTrigger
          className="ml-auto h-7 w-[120px] rounded-lg pl-2.5"
          aria-label={ t( "ariaLabel" ) }
        >
          <SelectValue placeholder={ t( "placeholder" ) }/>
        </SelectTrigger>
        <SelectContent align="end" className="rounded-xl">
          { availableYears.map( ( option ) => (
            <SelectItem key={ option } value={ String( option ) } className="rounded-lg">
              <div className="flex items-center gap-2 text-xs">{ option }</div>
            </SelectItem>
          ) ) }
        </SelectContent>
      </Select>
    </div>
  );
}