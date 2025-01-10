"use client"

import React from "react";
import Image from "next/image";
import logo from "@/../../public/pitstop_logo_white.png";
import "@/styles/hero.css";

const Hero = () => (
  <div className="hero">
    <div className="overlay"></div>
    <video autoPlay loop muted id='video'>
      <source src="pitstop.mp4" type='video/mp4' />
    </video>
    <div className="logoWrapper">
        <Image quality={100} src={logo} alt="Logo" width={300} height={200} className="transition opacity-0" onLoad={(e) => (e.target as HTMLImageElement).classList.remove("opacity-0")}/>
      </div>
  </div>
);

export default Hero

