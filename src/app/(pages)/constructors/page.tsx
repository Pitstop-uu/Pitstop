"use client"
import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";

// Define the type for a constructor object
interface ConstructorData {
  year: number;
  total_points: string | number; // Assuming total_points can be a string or number from API
  [key: string]: any; // Allow other properties if necessary
}

export default function AboutPage() {
  const [constructors, setConstructors] = useState<ConstructorData[]>([]);
  const [year, setYear] = useState(2024);
  const [selectedYear, setSelectedYear] = useState(2024);

  useEffect(() => {
    const fetchData = async () => {
      const response = await window.fetch(`/api/constructors?year=${year}`);
      const constructors = await response.json();
      setConstructors(constructors);
    }
    fetchData();
  }, [year])

  return (
    <div>
      <h1>Constructors</h1>
      <p>This is the about page of our Next.js app.</p>
      <input type="number" min={1950} max={2024} onChange={e => setSelectedYear(Number(e.target.value))}></input>
      <button onClick={(_) => setYear(selectedYear)}>Search</button>
      {
        constructors.map((obj, i) => (
          <div key={i}>{JSON.stringify(obj)}<br /></div>
        ))
      }

      <LineChart dataset={constructors.map(name => ({ ...name, total_points: Number(name.total_points) }))}
        xAxis={[{ dataKey: "year" }]}
        series={[
          {
            dataKey: "total_points",
            
          },
        ]}
        width={500}
        height={300}
      />

      

    </div>
  );
}