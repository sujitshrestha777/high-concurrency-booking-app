import { Navbar } from "components/Navbar";
export const dynamic = "force-dynamic";
import { HeroSection } from "../components/HeroSection";

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen font-sans">
      <HeroSection />
    </main>
  );
}
