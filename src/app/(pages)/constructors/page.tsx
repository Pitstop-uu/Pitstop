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
  [key: string]: any;
}

interface ConstructorData {
  label: string;
  data: number[];
}

type ConstructorDataPoint = {
  year: number;
  total_points: number;
}

type ConstructorRecord = Record<string, {
  label: string;
  data: ConstructorDataPoint[];
}>

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
      console.log('years', years);
      const response = await window.fetch(`/api/constructors?year=${years}`);
      const constructors = await response.json();

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

  const CustomTooltipContent = (props: any) => {
    const { axisValue } = props;
    const data = constructors.find((entry) => entry.year === axisValue);
    if (!data){
      return null;
    }
    return (
      <Paper sx={{ padding: 3 }}>
        {
          Object.keys(data || {}).map((key, i) => {
           return <p key={i}>{`${key}: ${data[key]}`}</p> 
          })
        }
      </Paper>
    );
  };

  return (
    <div className="container-constructors" style={{color: "white"}}>
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
          xAxis={[{dataKey: "year", scaleType: "point"}]}
          series={allConstructors.map((constructor) => ({
            dataKey: constructor, 
            label: constructor,
          }))}
          tooltip={{ trigger: 'axis', axisContent: CustomTooltipContent }}
          width={800}
          height={400}
          sx = {() => ({
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