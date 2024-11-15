"use client"

import React from "react";
import Image from "next/image";
import hero from "@/../../public/banner.jpg"
import logo from "@/../../public/pitstop_logo_white.png";
import "@/styles/hero.css";

const Hero = () => (
    <div className="hero">
      <Image src={hero} alt="Banner" layout="fill" quality={100} sizes="100vw" objectFit="cover" className="heroImage opacity-0" onLoadingComplete={(image => image.classList.remove("opacity-0"))}/>
        <div className="logoWrapper">
          <Image quality={100} src={logo} alt="Logo" width={200} height={100} />
        </div>
    </div>
  );

export default Hero

