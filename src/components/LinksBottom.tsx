import React from "react";
import  Link  from 'next/link';
import "@/styles/links.css";

const LinksBottom = () => (
    <div className="link-section">
    <span className="link-title">Get Started Now</span>
    <div className="link-bottom">
      <Link href="/constructors" className="link-button">
        <span>Constructors Standings</span> <span className="icon">&gt;</span>
      </Link>
      <Link href="/drivers" className="link-button">
        <span>Driver Standings</span> <span className="icon">&gt;</span>
      </Link>
      <Link href="/fastest-laps" className="link-button">
        <span>Fastest Laps</span> <span className="icon">&gt;</span>
      </Link>
    </div>
    <p style={{margin: '40px', textAlign: 'center' }}><a className='database-link' href="https://github.com/f1db/f1db">Database link (F1DB)</a></p>
  </div>
  );

export default LinksBottom