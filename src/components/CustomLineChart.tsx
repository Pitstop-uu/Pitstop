import * as React from "react";
import labelizeKey from "@/utils/frontend/labelizeKey";
import { axisClasses, chartsGridClasses, HighlightItemData, LineChart, lineElementClasses, markElementClasses } from "@mui/x-charts";
//import CustomTooltip from "./CustomTooltip";
//import CustomTooltipHighlight from "./CustomTooltipHighlight";

interface CustomLineChartProps {
    datapoints: any,
    series: any,
    bottomAxis: any,
    CustomTooltip: any,
    CustomTooltipHighlight: any,
    margin: any,
};

export default function CustomLineChart({ 
    datapoints,
    series,
    bottomAxis,
    CustomTooltip,
    CustomTooltipHighlight,
    margin,
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

    return (
        <LineChart
            dataset={datapoints}
            xAxis={[{
                dataKey: "key",
                scaleType: "point",
                position: "bottom",
                valueFormatter: (key, _) =>
                    `${labelizeKey(key)}`,
            }]}
            bottomAxis={bottomAxis}
            yAxis={[{ min: 0 }]}
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
                }
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