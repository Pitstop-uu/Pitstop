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

interface ConstructorItem {
  constructor_id: string;
  year: number;
  total_points: string | number;
}

type ConstructorResult = {
  year: number;
  [key: string]: number;
}

export default function AboutPage() {
  const [allConstructors, setAllConstructors] = useState<string[]>([]);
  const [constructors, setConstructors] = useState<ConstructorResult[]>([]);
  const [years, setYears] = useState([2020, 2024]);
  const [loading, setLoading] = useState(false);
  const minYear = 1950;
  const maxYear = 2024;
  const allYears = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
  const [highlightedItem, setHighLightedItem] = useState<HighlightItemData | null>(null);

  const handleYearSelection = (type: "FROM" | "TO", year: number) => {
    const [fromYear, toYear] = years;
    if (type === "FROM") {
      const updatedFromYear = year;
      setYears([updatedFromYear, Math.max(toYear, updatedFromYear)]);
    } else if (type === "TO") {
      const updatedToYear = year;
      setYears([Math.min(fromYear, updatedToYear), updatedToYear]);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      /*
      för att hämta standings för specifika constructors kan man också
      skicka med en lista med constructor-idn i request bodyn.
      T.ex. { from: 2020, to: 2024, constructors: [ 'mclaren', 'kick-sauber' ] }
      */
      const response = await window.fetch(
        `/api/constructors/getStandings`,
        {
          method: 'POST',
          body: JSON.stringify({ from: years[0], to: years[1] })
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
  }, [years])

  /**
   * Converts a key into a human-readable format with proper capitalization.
   * 
   * This function checks if the key is listed in a set of exceptions (e.g., 
   * "rb" -> "RB", "alphatauri" -> "AlphaTauri"). If the key is not in the 
   * exceptions list, the function will replace hyphens with spaces and capitalize 
   * the first letter of each word in the string.
   * 
   * @param {string} key - The key to be formatted.
   * @returns {string} - The formatted string with capitalized words, or the special transformation for exception keys.
   * 
   * @example
   * // If key is "some-key"
   * labelizeKey("some-key"); // Returns "Some Key"
   */
  const labelizeKey = (key: string): string => {

    const exceptions: { [key: string]: string } = {
      'rb': 'RB',
      'alphatauri': 'AlphaTauri',
    };

    if (exceptions[key]) {
      return exceptions[key];
    }

    const formattedKey = key.replace(/-/g, ' ');
    return formattedKey
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }


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
              return <p key={i}>{`${labelizedKey}: ${value}`}</p>
            }
            )}
      </Paper>
    );
  };

  const constructorColors = {
    'mclaren': '#FF8000',
    'ferrari': '#E80020',
    'red-bull': '#3671C6',
    'mercedes': '#27F4D2',
    'aston-martin': '#229971',
    'alpine': '#0093CC',
    'haas': '#B6BABD',
    'rb': '#6692FF',
    'williams': '#64C4FF',
    'kick-sauber': '#000000',
  }


  return (
    <section>
    <div className="container-constructors container-page" style={{ color: "white" }}>
      <Header />
      <div className="ml-12 mt-20">
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="hover:bg-[#252525]">TIMEFRAME: {years[0]}-{years[1]} <span className="rotate-90 ml-48">&gt;</span></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-96 max-h-60 overflow-y-auto grid grid-cols-2 gap-4 bg-[#252525]">
            <div className="flex flex-col">
              <p className="font-semibold mb-2">FROM:</p>
              {allYears.map((year) => (
                <DropdownMenuCheckboxItem
                  key={`from-${year}`}
                  checked={years[0] === year}
                  onCheckedChange={(checked) => checked && handleYearSelection("FROM", year)}
                >
                  {year}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
            <div className="flex flex-col">
              <p className="font-semibold mb-2">TO:</p>
              {allYears.map((year) => (
                <DropdownMenuCheckboxItem
                  key={`to-${year}`}
                  checked={years[1] === year}
                  disabled={year < years[0]}
                  onCheckedChange={(checked) => checked && handleYearSelection("TO", year)}
                >
                  {year}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      
      {
        !loading && (
          <LineChart
            dataset={constructors}
            xAxis={[{ dataKey: "year", scaleType: "point" }]}
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