import { SeatRow, SeatData } from "../lib/types/types";
import { Seat } from "./Seats";

interface SeatMapProps {
  rows: SeatRow[];
  selectedSeatIds: string[];
  onSeatToggle: (seat: SeatData) => void;
}

export function SeatMap({ rows, selectedSeatIds, onSeatToggle }: SeatMapProps) {
  return (
    <div className="flex-1 flex flex-col  overflow-y-auto [scrollbar-width:none] bg-gray-900/30 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm relative">
      {/* Cockpit / Header Visual */}
      <div className="absolute top-0 left-0 w-full min-h-full bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:50px_50px] opacity-30 pointer-events-none" />

      <div className="sticky top-0 z-20 p-4 bg-black/80 backdrop-blur-md border-b border-white/10 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Front of Plane
        </span>
      </div>

      {/* Scrollable Area */}
      <div className="flex-1 p-4 sm:p-8  ">
        <div className="flex flex-col items-center gap-3 pb-20">
          {rows.map((row) => (
            <div
              key={row.rowNumber}
              className="flex items-center gap-4 sm:gap-8 md:gap-12"
            >
              {/* Row Number */}
              <div className="w-6 text-right text-xs text-gray-600 font-mono">
                {row.rowNumber}
              </div>

              {/* Left Side */}
              <div className="flex gap-1 sm:gap-2">
                {row.leftSeats.map((seat) => (
                  <Seat
                    key={seat.id}
                    seat={seat}
                    isSelected={selectedSeatIds.includes(seat.id)}
                    onToggle={onSeatToggle}
                  />
                ))}
              </div>

              {/* Aisle */}
              <div className="w-4 sm:w-8 flex justify-center">
                <div className="h-12 w-[4px] bg-white/5" />
              </div>

              {/* Right Side */}
              <div className="flex gap-1 sm:gap-2">
                {row.rightSeats.map((seat) => (
                  <Seat
                    key={seat.id}
                    seat={seat}
                    isSelected={selectedSeatIds.includes(seat.id)}
                    onToggle={onSeatToggle}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
