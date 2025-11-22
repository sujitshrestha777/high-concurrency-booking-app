"use client";

import { SeatMap } from "components/SeatMap";
import { Summary } from "components/Summary";
import { SeatData, SeatRow } from "lib/types/types";
import { generatePlaneLayout } from "lib/util/util";
import { useState, useEffect } from "react";

export default function BookingPage() {
  const [rows, setRows] = useState<SeatRow[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SeatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setRows(generatePlaneLayout());
      setIsLoading(false);
    }, 500);
  }, []);

  const handleToggle = (seat: SeatData) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      }
      return [...prev, seat];
    });
  };

  return (
    <main className="h-screen bg-black text-white  flex flex-col relative px-2">
      {/* Background Elements */}

      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-black to-black -z-10" />
      <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] -z-10" />

      {/* Main Content Container */}
      <div className="flex-1 container mx-auto p-4 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-purple-400 animate-pulse text-xl">
              Loading Seat Map...
            </div>
          </div>
        ) : (
          <>
            {/* Left: The Map */}
            <SeatMap
              rows={rows}
              selectedSeatIds={selectedSeats.map((s) => s.id)}
              onSeatToggle={handleToggle}
            />

            {/* Right: The Summary */}
            <Summary selectedSeats={selectedSeats} />
          </>
        )}
      </div>
    </main>
  );
}
