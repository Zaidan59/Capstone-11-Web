import { useEffect } from "react";
import Hero from "./components/Hero";
import About from "./components/About";
import Maps from "./components/Map";
import DashboardPemantauan from "./components/DashboardPemantauan";
import FAQ from "./components/FAQ";
import Footer from "../../components/common/Footer";
import { Link } from "react-router-dom";

<Link to="/maps">View Full Map</Link> 


export default function Home() {
  useEffect(() => {
    document.title = "SIMBA - Transparansi Program MBG";
  }, []);

  return (
    <div style={{ fontFamily: "'Public Sans', sans-serif" }}>
      <Hero />
      <About />
      <Maps />
      <DashboardPemantauan />
      <FAQ />
      <Footer />
    </div>
  );
}
