import React from "react";
import  Link  from 'next/link';
import Image from "next/image";
import logo from "@/../../public/pitstop_logo_white.png";
import "@/styles/header.css";

const Header = () => (
    <header id="header">
      <nav className="header">
        <div>
          <Link href="/">
              <Image quality={100} width={156} height={49} src={logo} alt="logo"/>
          </Link>
        </div>
        <div className="links">
          <Link href="/constructors" className="navLink">
            Constructor Standings
          </Link>
          <Link href="/drivers" className="navLink">
            Driver Standings
          </Link>
          <Link href="/fastest-lap" className="navLink">
            Fastest Laps
          </Link>
        </div>
      </nav>
    </header>
  );

export default Header