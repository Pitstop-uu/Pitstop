"use client"
import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";
import "@/styles/constructors.css";
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import Paper from "@mui/material/Paper";

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
  const [years, setYears] = useState([2023, 2024]);
  const [firstYear, setFirstYear] = useState(2023);
  const [lastYear, setLastYear] = useState(2024);
  const [loading, setLoading] = useState(false);
  const minYear = 1950;
  const maxYear = 2024;

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
    <div className="container-constructors" style={{ color: "white" }}>
      <h1>Constructors</h1>
      <p>This is the about page of our Next.js app.</p>
      <input type="number" value={firstYear} min={minYear} max={maxYear} onChange={e => setFirstYear(Number(e.target.value))}></input>
      <input type="number" value={lastYear} min={minYear} max={maxYear} onChange={e => setLastYear(Number(e.target.value))}></input>

      <button onClick={(_) => {
        setConstructors([]);
        setYears([firstYear, lastYear]);
      }}>Search</button>

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
              };
            })}
            tooltip={{ trigger: 'axis', axisContent: CustomTooltipContent }}
            height={400}
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
            })}
          />
        )
      }

    </div>
  );
}