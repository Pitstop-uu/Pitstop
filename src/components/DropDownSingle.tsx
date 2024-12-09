"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"

interface DropDownSingleProps {
  interval: number[];
  setInterval: (selected: number[]) => void;
}

export default function DropDownSingle({ interval, setInterval }: DropDownSingleProps) {
  const minYear = 1958;
  const maxYear = 2024;
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

  const handleYearSelection = (year: number) => {
    setInterval([year, year]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex justify-between items-center px-2 hover:bg-[#252525] w-96">SELECT YEAR: {interval[1]} <span className="rotate-90 mr-2">&gt;</span></Button> 
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-2 w-96 max-h-60 overflow-y-auto grid grid-cols-2 gap-4 bg-[#252525] text-white p-2">
        {years.map((year) => (
          <DropdownMenuCheckboxItem
            key={`single-${year}`}
            checked={interval[0] === year && interval[1] === year}
            onCheckedChange={() => handleYearSelection(year)}
          >
            {year}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
