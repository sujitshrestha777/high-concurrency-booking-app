import { Navbar } from "components/Navbar";
import { HeroSection } from "../components/HeroSection";

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen font-sans">
      <Navbar />
      <HeroSection />
    </main>
  );
}
