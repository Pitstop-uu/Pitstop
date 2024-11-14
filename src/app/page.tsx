"use client"

import Image from "next/image";
import Header from "@/components/Header";
import banner from "@/../../public/banner.jpg"
import logo from "@/../../public/pitstop_logo_white.png";

export default function Home() {
  return (
    <>
    <section>
    <div className="container">
      <Header />
      <div className="banner">
      <Image src={banner} alt="Banner" layout="fill" quality={100} sizes="100vw" objectFit="cover" className="bannerImage opacity-0" onLoadingComplete={(image => image.classList.remove("opacity-0"))}/>
        
        <div className="logoWrapper">
          <Image quality={100} src={logo} alt="Logo" width={200} height={100} />
        </div>
      </div>
      
    </div>
    </section>

    <section>
      <div className="content-section">
        <div className="content">
          <span> <span className="highlight">WHAT IS PITSTOP?</span> A FORMULA 1 TOOL ASSISTING IN VISUALIZING HISTORICAL DATA RANGING ALL THE WAY FROM THE BEGINNING OF THE SPORT’S HISTORY - 1950.</span>
        </div>
        <div>
          <span className="content-description"> IT IS A FORMULA 1 TOOL ASSISTING IN VISUALIZING HISTORICAL DATA RANGING ALL THE WAY FROM START OF THE SPORT’S HISTORY - 1950. HERE YOU CAN LOOK AT HISTROICAL DATA FROM THE FASTEST LAP TIMES FOR EVERY DRIVER ON A SPECIFIC CIRCUIT THROUGHOUT SEASONS</span>
        </div>
      </div>
    </section>

    <section>
      <div className="preview-section">
        <span className="preview-title">SEARCH. DISCOVER. COMPARE</span>
      </div>
    </section>
    </>
  );
}

