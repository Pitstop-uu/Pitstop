"use client"

import React from "react";
import { DropdownMenuMultiple } from "./DropDownFilterMultiple";
import labelizeKey from "@/utils/frontend/labelizeKey";

interface DriverDropDownFilterMultipleProps {
    selectableDrivers: { key: string, value: string}[];
    selectedDrivers: string[];
    setSelectedDrivers: (selected: string[]) => void;
    years: [number, number];
}

export default function DriverDropDownFilterMultiple({
    selectableDrivers,
    selectedDrivers,
    setSelectedDrivers,
    years
}: DriverDropDownFilterMultipleProps) {
    const noneSelected = selectedDrivers.length === 0;

    const limitDriverNames = (driverList: string[]): string => {
        let result = "";
        driverList.forEach(driver => {
            result += labelizeKey(driver) + ", ";
        });

        result = result.slice(0, result.length-2);

        if (result.length > 29) {
            result = result.slice(0, 26) + "..."
        };

        return result;
    }

    const list = selectableDrivers.map(({key}) => ({
        key,
        value: labelizeKey(key)
    }))

    return (
        <DropdownMenuMultiple
            list={list}
            title={`SELECT DRIVERS: ${noneSelected ? (years[0] === years[1] ? "ALL" : "NONE") : limitDriverNames(selectedDrivers)}`}
            selected={selectedDrivers}
            setSelected={setSelectedDrivers}
        />
    );
}