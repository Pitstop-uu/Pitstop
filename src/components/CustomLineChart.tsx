import * as React from "react";
import labelizeKey from "@/utils/frontend/labelizeKey";
import { axisClasses, chartsGridClasses, HighlightItemData, LineChart, lineElementClasses, markElementClasses } from "@mui/x-charts";
import formatMillis from "@/utils/frontend/formatMillis";

interface CustomLineChartProps {
    datapoints: any,
    series: any,
    bottomAxis: any,
    CustomTooltip: any,
    CustomTooltipHighlight: any,
    margin: any,
    displayPoints: boolean,
    selectedGrandPrix?: string,
    emptyXAxis: any[],
};

export default function CustomLineChart({
    datapoints,
    series,
    bottomAxis,
    CustomTooltip,
    CustomTooltipHighlight,
    margin,
    displayPoints,
    selectedGrandPrix,
    emptyXAxis,
}: CustomLineChartProps) {
    const [highlightedItem, setHighlightedItem] = React.useState<HighlightItemData | null>(null);

    const CustomTooltipContent = (props: any) => {
        const { axisValue } = props;
        if (!highlightedItem) {
            return (
                <CustomTooltip axisValue={axisValue} />
            );
        };
        return (
            <CustomTooltipHighlight highlightedItem={highlightedItem} axisValue={axisValue} />
        );
    };

    const yAxisMin = (Math.floor(Math.min(
        ...datapoints.flatMap((point: any) => Object.values(point).filter(value => typeof value === 'number'))
    ) - 500) / 500) * 500;

    const yAxisMax = Math.ceil(Math.max(
        ...datapoints.flatMap((point: any) => Object.values(point).filter(value => typeof value === 'number'))
    ) / 500) * 500;

    return (
        <LineChart
            dataset={datapoints}
            xAxis={[datapoints.length
                ? {
                    dataKey: "key",
                    scaleType: "point",
                    position: "bottom",
                    valueFormatter: (key) =>
                        `${labelizeKey(String(key))}`,
                }
                : {
                    data: emptyXAxis,
                    scaleType: "point",
                }
            ]}
            bottomAxis={bottomAxis}
            yAxis={
                displayPoints
                    ? [datapoints.length
                        ? { min: 0 }
                        : { min: 0, max: 600 }
                    ]
                    : [datapoints.length
                        ? { min: yAxisMin, max: yAxisMax, valueFormatter: (key) => `${formatMillis(key)}` }
                        : { min: 0, max: 90000, valueFormatter: (key) => `${formatMillis(key)}` }
                    ]
            }
            series={series}
            tooltip={{ trigger: 'axis', axisContent: CustomTooltipContent }}
            axisHighlight={{ x: 'line' }}
            height={480}
            highlightedItem={highlightedItem}
            onHighlightChange={setHighlightedItem}
            grid={{ vertical: true, horizontal: true }}
            margin={margin}
            slotProps={{
                legend: {
                    hidden: true,
                },
                noDataOverlay: displayPoints
                    ? { message: 'Loading...' }
                    : selectedGrandPrix
                        ? { message: 'No data selected' }
                        : { message: 'No Grand Prix selected' }
            }}
            sx={() => ({
                [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                        stroke: 'white',
                        strokeWidth: 3,
                    },
                    [`.${axisClasses.tickLabel}`]: {
                        fill: 'white',
                    },
                },
                [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
                    strokeWidth: 4,
                },
                [`.${chartsGridClasses.line}`]: {
                    strokeDasharray: '5 3',
                    strokeWidth: 1,
                    stroke: 'rgba(255, 255, 255, 0.12)',
                },
            })}
        />
    );
};