'use client'

import React, { useEffect, useState } from "react";
import  Link  from 'next/link';
import Image from "next/image";
import logo from "@/../../public/pitstop_logo_white.png";
import "@/styles/header.css";


const Header = () => {
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <header id="header">
    <nav className="header">
      <div>
        <Link href="/">
            <Image quality={100} width={156} height={49} src={logo} alt="logo"/>
        </Link>
      </div>
      <div className="links">
        <Link href="/constructors" className={`navLink ${currentPath === '/constructors' ? 'active' : ''}`}>
          Constructor Standings
        </Link>
        <Link href="/drivers" className={`navLink ${currentPath === '/drivers' ? 'active' : ''}`}>
          Driver Standings
        </Link>
        <Link href="/fastest-laps" className={`navLink ${currentPath === '/fastest-laps' ? 'active' : ''}`}>
          Fastest Laps
        </Link>
      </div>
    </nav>
  </header>
  ); 
  };

export default Header