import Header from "@/components/Header";
import Hero from "@/components/Hero";
import "@/styles/homepage.css";
import ScrollContext from "@/components/ScrollContext";
import LinksBottom from "@/components/LinksBottom";

export default function HomePage() {
  return (
    <ScrollContext>
    <section>
    <div className="container">
      <Header />
      <Hero />
    </div>
    </section>

    <section>
      <div className="content-section">
        <div className="content">
          <span> <span className="highlight">WHAT IS PITSTOP?</span> A FORMULA 1 TOOL ASSISTING IN VISUALIZING HISTORICAL DATA RANGING ALL THE WAY FROM THE BEGINNING OF THE SPORT’S HISTORY - 1950.</span>
        </div>
        <span className="content-description-text"> IT IS A FORMULA 1 TOOL ASSISTING IN VISUALIZING HISTORICAL DATA RANGING ALL THE WAY FROM START OF THE SPORT’S HISTORY - 1950. HERE YOU CAN LOOK AT HISTROICAL DATA FROM THE FASTEST LAP TIMES FOR EVERY DRIVER ON A SPECIFIC CIRCUIT THROUGHOUT SEASONS</span>
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

