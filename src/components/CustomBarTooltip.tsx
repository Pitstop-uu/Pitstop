import * as React from "react"
import Paper from "@mui/material/Paper";
import labelizeKey from "@/utils/frontend/labelizeKey";
import { constructorColors } from "./ui/ConstructorColors";

interface CustomBarTooltipProps {
    drivers: { 
        key: any,
        [prop: string]: number
    },
    allDrivers: {
        driver: string,
        constructor: string
    }[]
};

export default function CustomBarTooltip({ drivers, allDrivers }: CustomBarTooltipProps) {

    if (!drivers) {
        return null;
    }

    const { key, ...rest } = drivers;

    return (
        <Paper sx={{ padding: 2, backgroundColor: '#252525', color: '#ffffff' }}>
            <p style={{ textAlign: 'center' }} >{labelizeKey(String(key))}</p>
            <hr style={{ height: '1px', marginBottom: '2px' }} />
            {
                Object.entries(rest)
                    .sort(([, a], [, b]) => Number(b) - Number(a))
                    .map(([key, value], i) => {

                        const driver = allDrivers.find(({driver, constructor}: { driver: string, constructor: string }) => driver === key) || { driver: '', constructor: '' }

                        const constructorColor = String(driver.constructor) in constructorColors
                            ? constructorColors[driver.constructor as keyof typeof constructorColors]
                            : '#888';

                        return (
                            <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: constructorColor, marginRight: 5, marginTop: 2, }} />
                                {`${labelizeKey(key)}: ${value} pts`}
                            </p>
                        )
                    }
                    )}
        </Paper>
    );
}