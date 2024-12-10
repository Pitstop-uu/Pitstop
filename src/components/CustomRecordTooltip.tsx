import * as React from "react"
import Paper from "@mui/material/Paper";
import labelizeKey from "@/utils/frontend/labelizeKey";
import formatMillis from "@/utils/frontend/formatMillis";

interface CustomRecordTooltipProps {
    drivers: { 
        key: any,
        [prop: string]: number
    },
    allDrivers: {
        driver: string,
        constructor: string
    }[],
    driverConstructors: {
        [driver: string]: { [year: string]: string }
    },
};

export default function CustomBarTooltip({ drivers, allDrivers, driverConstructors }: CustomRecordTooltipProps) {

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
                    .sort(([, a], [, b]) => Number(a) - Number(b))
                    .map(([k, value], i) => {

                        const driver = allDrivers.find(({driver}: { driver: string, constructor: string }) => driver === k) || { driver: '', constructor: '' }

                        return (
                            <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#008080', marginRight: 5, marginTop: 2, }} />
                                {`${driverConstructors[driver.driver][key]}: ${formatMillis(value)}`}
                            </p>
                        )
                    }
                    )}
        </Paper>
    );
}