import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-black text-white backdrop-blur sticky h-16 top-0 z-50">
      <div className="container flex px-32 py-2 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">BookIt</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/booking"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Book Seats
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href="/booking">Book Now</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
