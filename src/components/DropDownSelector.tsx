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
import { Switch } from "@/components/ui/switch"
import { Label } from "@radix-ui/react-dropdown-menu";


interface DropDownSelectorProps {
  interval: number[];
  setInterval: (selected: number[]) => void;
  minYear: number;
}

export default function DropDownSelector({ interval, setInterval, minYear }: DropDownSelectorProps) {
  const [mode, setMode] = useState<"range" | "single">("range");

  const toggleMode = () => {
    if (mode === "range") {
      setInterval([interval[1], interval[1]]);
    }
    
    setMode((prevMode) => (prevMode === "range" ? "single" : "range"));
  };

  const displayText = 
    mode === "range"
      ? `TIMEFRAME: ${interval[0]}-${interval[1]}`
      : `YEAR: ${interval[1]}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button variant="outline" className="flex justify-between items-center hover:bg-[#252525] min-w-[350px] text-white">
        <div className="text-left">{displayText}</div>
        <span className="rotate-90 mr-2">&gt;</span>
      </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="overflow-y-auto bg-[#252525] text-white w-96">
      <DropdownMenuSeparator />
      <DropdownMenuLabel className="text-white items-center text-center">
            Selection Method
      </DropdownMenuLabel>
      <div className="flex justify-evenly items-center border-b pb-4">
          <Label
            className={` ${
              mode === "range" ? "text-white font-bold" : "text-gray-400"
            }`}
          >
            Interval
          </Label>
          <Switch
            checked={mode === "single"}
            onCheckedChange={toggleMode}
          />
          <Label
          className={`${
              mode === "single" ? "text-white font-bold" : "text-gray-400"
            }`}
          >
            Specific
          </Label>
        </div>
        <div className="text-left pt-1">
        {mode === "range" ? (
          <FilterInterval interval={interval} setInterval={setInterval} minYear={minYear}/>
        ) : (
          <DropDownSingle interval={interval} setInterval={setInterval} minYear={minYear} />
        )}
        

        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
