"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"

interface GrandPrixDropDownFilterSingleProps {
    grandPrix: string[];
    setGrandPrix: (selected: string) => void;
}

export default function GrandPrixDropDownFilterSingle({ grandPrix, setGrandPrix }: GrandPrixDropDownFilterSingleProps) {

  const handleGrandPrixSelection = (grand_prix: string) => {
    setGrandPrix(grand_prix);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex justify-between items-center px-2 hover:bg-[#252525] w-96">SELECT GRAND PRIX: {grandPrix[0]} <span className="rotate-90 mr-2">&gt;</span></Button> 
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-2 w-96 max-h-60 overflow-y-auto grid grid-cols-2 gap-4 bg-[#252525] text-white p-2">
        {grandPrix.map((grand_prix) => (
          <DropdownMenuCheckboxItem
            key={`single-${grand_prix}`}
            checked={grandPrix[0] === grand_prix} // TODO: ???
            onCheckedChange={() => handleGrandPrixSelection(grand_prix)}
          >
            {grandPrix}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
