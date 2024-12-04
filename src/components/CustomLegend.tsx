"use client"

import * as React from "react"
import { ConstructorResult } from "@/app/(pages)/constructors/page";
import labelizeKey from "@/utils/frontend/labelizeKey";
import { constructorColors } from "./ui/ConstructorColors";

interface CustomLegendProps {
    constructors: ConstructorResult[];
    latestConstructorIdMap: { [key: string]: string };
    allDrivers?: {
        driver: string,
        constructor: string,
    }[];
}

const getConstructorNames = (data: Array<Record<string, any>>): string[] => {
    const constructorNames = new Set<string>();

    data.forEach((item) => {
        Object.keys(item).forEach((name) => {
            if (name !== "key") {
                constructorNames.add(name);
            }
        });
    });

    return Array.from(constructorNames);
};

export default function CustomLegend({ constructors, latestConstructorIdMap, allDrivers }: CustomLegendProps) {
    const constructorNames = getConstructorNames(constructors);
    const scaleFactor = Math.max(1 - (constructorNames.length - 10) * 0.05, 0.7);

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
            }}>
            {constructorNames.map((constructorName) => {
                
                const driver = (allDrivers || []).find(({ driver }: { driver: string, constructor: string }) => driver === constructorName) || { driver: '', constructor: '' }

                return (<div
                    key={constructorName}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flex: "0 1 auto",
                        fontSize: `${16 * scaleFactor}px`,
                        marginBottom: `${5 * scaleFactor}px`,
                        fill: "white",
                    }}>
                    <span
                        style={{
                            width: `${24 * scaleFactor}px`,
                            height: `${3 * scaleFactor}px`,
                            backgroundColor: allDrivers 
                            ? `${String(driver.constructor) in constructorColors
                                    ? constructorColors[driver.constructor as keyof typeof constructorColors]
                                    : '#888'
                                }`
                            : `${constructorName in constructorColors
                                ? constructorColors[constructorName as keyof typeof constructorColors]
                                : '#888'
                                }`,
                            marginRight: `${10 * scaleFactor}px`,
                            marginLeft: `${20 * scaleFactor}px`,
                        }}></span>
                    {constructorName === latestConstructorIdMap[constructorName] ? labelizeKey(constructorName) : allDrivers ? labelizeKey(constructorName) : `${labelizeKey(constructorName)} (${labelizeKey(String(latestConstructorIdMap[constructorName]))})`}
                </div>
            )})}
        </div>
    );
}