import { useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import FAQ from "./components/FAQ";
import DashboardPemantauan from "./components/DashboardPemantauan";
import About from "./components/About";
import Hero from "./components/Hero";
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

      <DashboardPemantauan />
      <FAQ />
      <Footer />
    </div>
  );
}