"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import FilterInterval from "@/components/FilterInterval";
import DropDownSingle from "@/components/DropDownSingle";
import { Button } from "@/components/ui/button"


interface DropDownSelectorProps {
  interval: number[];
  setInterval: (selected: number[]) => void;
}

export default function DropDownSelector({ interval, setInterval }: DropDownSelectorProps) {
  const [mode, setMode] = useState<"range" | "single">("range");

  const toggleMode = () => {
    if (mode === "range") {
      setInterval([interval[1], interval[1]]);
    }
    
    setMode((prevMode) => (prevMode === "range" ? "single" : "range"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button variant="outline" className="flex justify-between items-center hover:bg-[#252525] min-w-[350px] text-white">
        <div className="text-left">
          {mode === "range"
            ? `TIMEFRAME: ${interval[0]}-${interval[1]}`
            : `YEAR: ${interval[0]}`}
        </div>
        <span className="rotate-90 mr-2">&gt;</span>
      </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="overflow-y-auto bg-[#252525] text-white w-96">
      <DropdownMenuSeparator />
        <DropdownMenuLabel onClick={toggleMode} className=" cursor-pointer text-white hover:text-[#008080] border-b pb-4">
          SELECTION METHOD: {mode === "range" ? "INTERVAL" : "SPECIFIC"}
        </DropdownMenuLabel>
        <div className="text-left pt-1">
        {mode === "range" ? (
          <FilterInterval interval={interval} setInterval={setInterval}/>
        ) : (
          <DropDownSingle interval={interval} setInterval={setInterval} />
        )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
