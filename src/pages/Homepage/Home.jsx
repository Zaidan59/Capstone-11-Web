import { useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Maps from "./components/Maps";
import DashboardPemantauan from "./components/DashboardPemantauan";
import FAQ from "./components/FAQ";
import Footer from "../../components/common/Footer";


export default function Home() {
  useEffect(() => {
    document.title = "SIMBA - Transparansi Program MBG";
  }, []);

  return (
    <div style={{ fontFamily: "'Public Sans', sans-serif" }}>
      <Navbar />
      <Hero />
      <About />
      <Maps />
      <DashboardPemantauan />
      <FAQ />
      <Footer />
    </div>
  );
}