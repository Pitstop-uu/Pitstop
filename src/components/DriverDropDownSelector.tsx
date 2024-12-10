"use client";

import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"
import labelizeKey from "@/utils/frontend/labelizeKey";


interface DriverDropDownSelectorProps {
    selectableDrivers: { key: string, value: string }[];
    selectedDrivers: string[];
    setSelectedDrivers: (selected: string[]) => void;
}

export default function DriverDropDownSelector({ selectableDrivers, selectedDrivers, setSelectedDrivers }: DriverDropDownSelectorProps) {
    console.log("selectable drivers", selectableDrivers);
    const [mode, setMode] = useState<"record" | "specify">("specify");

    const limitDriverNames = (driverList: string[]): string => {
        let result = "";
        driverList.forEach(driver => {
            result += labelizeKey(driver) + ", ";
        });

        result = result.slice(0, result.length - 2);

        if (result.length > 29) {
            result = result.slice(0, 26) + "..."
        };

        return result;
    }

    const toggleMode = () => {
        setMode((prevMode) => {

            prevMode === "specify"
                ? setSelectedDrivers(["record"])
                : setSelectedDrivers([]);

            return (prevMode === "record" ? "specify" : "record");
        });
    };

    const noneSelected = selectedDrivers.length === 0;

    const displayText =
        mode === "record"
            ? `SELECT DRIVERS: FASTEST LAP RECORDS`
            : `SELECT DRIVERS: ${noneSelected ? "NONE" : limitDriverNames(selectedDrivers)}`;

    const list = selectableDrivers.map(({ key }) => ({
        key,
        value: labelizeKey(key)
    }))


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
                <DropdownMenuLabel onClick={toggleMode} className={mode === "record" ? "cursor-pointer text-white hover:text-[#008080] pb-4" : "cursor-pointer text-white hover:text-[#008080] border-b pb-4"}>
                    SELECTION METHOD: {mode === "record" ? "RECORDS" : "SPECIFIC DRIVERS"}
                </DropdownMenuLabel>
                {mode === "record"
                    ? <></>
                    : <div className="text-left w-96 max-h-60 overflow-y-auto grid bg-[#252525] text-white p-2">
                        <DropdownMenuSeparator />
                        {
                            selectableDrivers.length
                                ? (list.map(({ key, value }) => (
                                    <DropdownMenuCheckboxItem
                                        key={key}
                                        checked={selectedDrivers.find(item => item === key) !== undefined}
                                        onCheckedChange={(checked) => {
                                            const newSelected = checked
                                                ? selectedDrivers.concat(key)
                                                : selectedDrivers.filter(item => item !== key)
                                            setSelectedDrivers(newSelected);
                                        }}
                                        onSelect={(event) => {
                                            event.preventDefault()
                                        }}
                                    >
                                        {value}
                                    </DropdownMenuCheckboxItem>
                                ))
                                )
                                : <p className="text-center pb-2" >No Grand Prix selected</p>
                        }
                    </div>
                }
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
