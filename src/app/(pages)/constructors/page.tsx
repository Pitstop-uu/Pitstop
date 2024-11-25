"use client"

import "@/styles/constructors.css";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { LineChart, lineElementClasses, markElementClasses } from "@mui/x-charts";
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { HighlightItemData } from "@mui/x-charts/context";
import Paper from "@mui/material/Paper";

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { constructorColors } from '@/components/ui/ConstructorColors.ts';
import ConstructorDropDownFilterMultiple from '@/components/ConstructorDropDownFilterMultiple';
import DropDownFilterInterval from '@/components/DropDownFilterInterval';
import labelizeKey from "@/utils/frontend/labelizeKey";

interface ConstructorItem {
  constructor_id: string;
  year: number;
  total_points: string | number;
}

type ConstructorResult = {
  year: number;
  [key: string]: number;
}

export default function ConstructorsPage() {
  const [allConstructors, setAllConstructors] = useState<string[]>([]);
  const [constructors, setConstructors] = useState<ConstructorResult[]>([]); // TODO: Rename to datapunkt eller nåt
  const [selectedConstructors, setSelectedConstructors] = useState<string[]>(['mclaren', 'ferrari', 'red-bull', 'mercedes', 'aston-martin', 'alpine', 'haas', 'rb', 'williams', 'kick-sauber',]);
  const [years, setYears] = useState([2020, 2024]);
  const [loading, setLoading] = useState(false);
  const minYear = 1950;
  const maxYear = 2024;
  const allYears = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
  const [highlightedItem, setHighLightedItem] = useState<HighlightItemData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      /*
      för att hämta standings för specifika constructors kan man också
      skicka med en lista med constructor-idn i request bodyn.
      T.ex. { from: 2020, to: 2024, constructors: [ 'mclaren', 'kick-sauber' ] }
      */
      const requestBody: { [key: string]: any } = { from: years[0], to: years[1] }
      if (selectedConstructors.length) {
        requestBody.constructors = selectedConstructors;
      }
      const response = await window.fetch(
        `/api/constructors/getStandings`,
        {
          method: 'POST',
          body: JSON.stringify(requestBody)
        }
      )
      const responseJson = await response.json();
      const constructors = responseJson.data;

      const constructorList: string[] = [];
      const transformedData = constructors.reduce((acc: ConstructorResult[], { year, constructor_id, total_points }: ConstructorItem) => {
        if (!constructorList.find((c_id) => c_id === constructor_id)) {
          constructorList.push(constructor_id);
        }
        const yearEntry = acc.find((entry) => entry.year === year);
        if (yearEntry) {
          yearEntry[constructor_id] = Number(total_points);
        } else {
          acc.push({ year, [constructor_id]: Number(total_points) });
        }
        return acc;
      }, []);

      setAllConstructors(constructorList)
      setConstructors(transformedData);
      setLoading(false);
    }
    fetchData();
  }, [years, selectedConstructors])

  /**
   * Custom Tooltip Component for rendering data in a tooltip.
   * 
   * This component renders a custom tooltip that displays key-value pairs for 
   * a specific year, with special formatting for certain keys. The `year` key 
   * is displayed separately with centered text, while the rest of the keys are 
   * shown in descending order.
   * 
   * @param {Object} props - The component's props.
   * @param {string} props.axisValue - The year value used to retrieve the corresponding data.
   * 
   * @returns {JSX.Element | null} - Returns a Paper component containing the tooltip content,
   *                                  or `null` if no data is found for the specified year.
   * 
   * @example
   * // When year is "2022"
   * <CustomTooltipContent axisValue="2022" />
   */
  const CustomTooltipContent = (props: any) => {
    const { axisValue } = props;

    if (!highlightedItem) {
      const data = constructors.find((entry) => entry.year === axisValue);

      if (!data) {
        return null;
      }

      const { year, ...rest } = data;

      return (
        <Paper sx={{ padding: 2, backgroundColor: '#252525', color: '#ffffff' }}>
          <p style={{ textAlign: 'center' }} >{year}</p>
          <hr style={{ height: '1px', marginBottom: '2px' }} />
          {
            Object.entries(rest)
              .sort(([, a], [, b]) => Number(b) - Number(a))
              .map(([key, value], i) => {
                const labelizedKey = labelizeKey(key)

                const constructorColor = key in constructorColors
                  ? constructorColors[key as keyof typeof constructorColors]
                  : '#888';

                return (
                  <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: constructorColor, marginRight: 5, marginTop: 2, }} />
                    {`${labelizedKey}: ${value} pts`}
                  </p>
                )
              }
              )}
        </Paper>
      );
    };

    const { seriesId } = highlightedItem;
    const index = Number(String(seriesId).match(/\d+/g));
    const constructorName: string = allConstructors[index];

    const constructorData = constructors
      .filter(entry => entry[constructorName] !== undefined && entry[constructorName] !== null)
      .map(entry => ({
        year: entry.year,
        points: entry[constructorName],
      }));

    const constructorColor = constructorName in constructorColors
      ? constructorColors[constructorName as keyof typeof constructorColors]
      : '#888';

    return (
      <Paper sx={{ padding: 2, backgroundColor: '#252525', color: '#ffffff' }}>
        <p style={{ textAlign: 'center' }} >{labelizeKey(constructorName)}</p>
        <hr style={{ height: '1px', marginBottom: '2px' }} />
        {constructorData.reverse().map((entry, i) => {
          const isCurrentYear = entry.year === axisValue;
          return (
            <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrentYear ? constructorColor : 'transparent', marginRight: 5, marginTop: 2, }} />
              {`${entry.year}: ${entry.points} pts`}
            </p>
          );
        })}
      </Paper>
    );
  };

  return (
    <section>
      <div className="container-constructors container-page" style={{ color: "white" }}>
        <Header />
        
        <div className="ml-12 mt-20">
          <DropDownFilterInterval
            interval={years}
            setInterval={setYears}
          />

          <ConstructorDropDownFilterMultiple
            yearFrom={years[0]}
            yearTo={years[1]}
            selectedConstructors={selectedConstructors}
            setSelectedConstructors={setSelectedConstructors}
          />
        </div>

        {
          !loading && (
            <LineChart
              dataset={constructors}
              xAxis={[{ dataKey: "year", scaleType: "point", position: "bottom" }]}
              yAxis={[{ min: 0 }]}
              series={allConstructors.map((constructor) => {

                const constructorColor = constructor in constructorColors
                  ? constructorColors[constructor as keyof typeof constructorColors]
                  : '#888';

                return {
                  dataKey: constructor,
                  label: labelizeKey(constructor),
                  color: constructorColor,
                  curve: 'linear',
                  showMark: false,
                  highlightScope: { highlight: 'item', fade: 'global' },
                };
              })}
              tooltip={{ trigger: 'axis', axisContent: CustomTooltipContent }}
              axisHighlight={{ x: 'line' }}
              height={600}
              margin={{ bottom: 120 }}
              highlightedItem={highlightedItem}
              onHighlightChange={setHighLightedItem}
              grid={{ vertical: true, horizontal: true }}
              slotProps={{
                legend: {
                  position: {
                    vertical: 'bottom',
                    horizontal: 'middle',
                  },
                  labelStyle: {
                    fontSize: 16,
                    fill: 'white',
                  },
                  itemMarkWidth: 24,
                  itemMarkHeight: 3,
                  markGap: 10,
                  itemGap: 20,
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
          )
        }

      </div>

    </section>
  );
}