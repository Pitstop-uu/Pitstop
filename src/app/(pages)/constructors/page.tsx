"use client"
import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";
import "@/styles/constructors.css";
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { AxisConfig } from '@mui/x-charts'

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


export default function AboutPage() {
  const [constructors, setConstructors] = useState<ConstructorData[]>([]);
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

      const constructorDataMap = constructors.reduce((acc: ConstructorRecord, constructor: ConstructorItem) => {
        const { constructor_id, year, total_points } = constructor;
        if (!acc[constructor_id]) {
          acc[constructor_id] = { label: constructor_id, data: [] };
        }

        acc[constructor_id].data.push({ year, total_points: Number(total_points) });
        acc[constructor_id].data.sort((a, b) => a.year - b.year);
        return acc;
      }, {} as ConstructorRecord);

      const constructorSeries = [];
      for (const key in constructorDataMap) {
        const { label, data } = constructorDataMap[key];
        constructorSeries.push(
          { label, data: data.map((dataPoint: ConstructorDataPoint) => dataPoint.total_points) }
        )
      }

      setConstructors(constructorSeries);
      console.log(constructorSeries);
      setLoading(false);
    }
    fetchData();
  }, [years])

  

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
          xAxis={[{data: Array.from({ length: years[1] - years[0] + 1 }, (_, i) => years[0] + i), scaleType: "point"}]}
          series={constructors}
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