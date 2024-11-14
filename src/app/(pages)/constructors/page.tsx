"use client"
import { useEffect, useState } from "react";

export default function AboutPage() {
  const [names, setNames] = useState([]);
  const [year, setYear] = useState(2024);
  const [selectedYear, setSelectedYear] = useState(2024);

  useEffect(() => {
    const fetchData = async () => {
      const response = await window.fetch(`/api/constructors?year=${year}`);
      const constructorNames = await response.json();
      setNames(constructorNames);
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
        names.map((obj, i) => (
          <div key={i}>{JSON.stringify(obj)}<br /></div>
        ))
      }
    </div>
  );
}