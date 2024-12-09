"use client"
import { useEffect } from "react";

export default function AboutPage() {
  useEffect(() => {
    const fetchData = async () => {
        const request = {
            from: 2020,
            to: 2024,
            grand_prix_id: "spain"
        }
        const res = await window.fetch("/api/grand_prix/123/getFastestLaps", {
            method: "POST",
            body: JSON.stringify(request)
        })
        const resJSON = await res.json();
        console.log(resJSON);
    }
    fetchData();
  }, [])

  return <></>
}