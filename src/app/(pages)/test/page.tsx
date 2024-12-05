"use client"
import { useEffect, useState } from "react";

export default function AboutPage() {
  useEffect(() => {
    const fetchData = async () => {
        const request = {
            from: 2020,
            to: 2024,
            grand_prix_id: "spain"
        }
        const res = await window.fetch("/api/circuit/spain/getFastestLaps", {
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