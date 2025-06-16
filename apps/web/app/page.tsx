import Image from "next/image";
import { HeroSection } from "../components/HeroSection";

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen font-sans">
      <header className="flex justify-between items-center px-8 py-4">
        <div className="text-2xl font-bold text-cyan-400">DIGIFINEX</div>
        <nav className="flex gap-6 text-sm">
          <a href="#">Buy Crypto</a>
          <a href="#">Market</a>
          <a href="#">Trade</a>
          <a href="#">Card</a>
          <button className="bg-cyan-400 text-black px-4 py-2 rounded">
            Sign Up
          </button>
        </nav>
      </header>

      <HeroSection />
    </main>
  );
}
