import { SeatRow, SeatData } from "../lib/types/types";
import { Seat } from "./Seats";

interface SeatMapProps {
  rows: SeatRow[];
  selectedSeatIds: string[];
  onSeatToggle: (seat: SeatData) => void;
}

export function SeatMap({ rows, selectedSeatIds, onSeatToggle }: SeatMapProps) {
  let economyHeaderDisplayed = true;

  return (
    <div className="flex-1 relative overflow-hidden bg-gray-900/30 border border-white/10 rounded-2xl backdrop-blur-sm flex flex-col">
      {/* background pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:50px_50px] opacity-30 pointer-events-none" />

      <div className="relative z-10 flex-1 overflow-y-auto [scrollbar-width:none] h-full">
        {/* Cockpit / Header Visual */}
        <div className="sticky top-0 z-20 p-4 bg-black/80 backdrop-blur-md border-b border-white/10 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Front of Plane
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-8">
          <div className="text-center py-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ml-8">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-lg border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300 drop-shadow-md">
                Premium Business
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 pb-20">
            {rows.map((row) => {
              // Check if we need to show economy header
              let showEconomyHeader = false;
              if (economyHeaderDisplayed) {
                const hasEconomySeat =
                  row.leftSeats.some((seat) => seat.type === "economy") ||
                  row.rightSeats.some((seat) => seat.type === "economy");
                if (hasEconomySeat) {
                  showEconomyHeader = true;
                  economyHeaderDisplayed = false;
                }
              }

              return (
                <div key={row.rowNumber}>
                  {/* Economy Header */}
                  {showEconomyHeader && (
                    <div className="text-center py-6 ml-8">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-md">
                        Economy Class
                      </span>
                    </div>
                  )}

                  {/* Seat Row */}
                  <div className="flex items-center gap-4 sm:gap-8 md:gap-12">
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
