import Header from "@/components/Header";
import Hero from "@/components/Hero";
import "@/styles/homepage.css";
import ScrollContext from "@/components/ScrollContext";
import LinksBottom from "@/components/LinksBottom";

export default function HomePage() {
  return (
    <ScrollContext>
    <section>
    <div className="container-new">
      <Header />
      <Hero />
    </div>
    </section>

    <section>
      <div className="content-section">
        <div className="content">
          <span> <span className="highlight">WHAT IS PITSTOP?</span> PITSTOP IS AN INNOVATIVE FORMULA 1 TOOL DESIGNED TO BRING THE SPORT&apos;S RICH HISTORY TO LIFE. THROUGH DYNAMIC DATA VISUALIZATIONS COVERING EVERY SEASON SINCE F1 BEGAN IN 1950, PITSTOP LETS YOU EXPLORE THE EVOLUTION OF FORMULA 1 IN A COMPLETELY NEW WAY.</span>
        </div>
        <span className="content-description-text"> DISCOVER HISTORICAL DATA SUCH AS FASTEST LAP TIMES FOR EACH DRIVER ON SPECIFIC CIRCUITS ACROSS ALL SEASONS. DIVE DEEP INTO PERFORMANCE TRENDS, TRACK RECORDS, AND THE EVOLUTION OF SPEED, PRECISION, AND COMPETITION IN FORMULA 1—ALL IN ONE INTUITIVE PLATFORM.</span>
      </div>
    </section>

    <section>
      <div className="preview-section">
        <span className="preview-title">SEARCH. DISCOVER. COMPARE</span>
      </div>
    </section>

    <section>
      <LinksBottom />
    </section>
    </ScrollContext>
  );
}

