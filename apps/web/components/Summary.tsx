import { SeatData } from "../lib/types/types";

export function Summary({ selectedSeats }: { selectedSeats: SeatData[] }) {
  const total = selectedSeats.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="lg:w-96 w-full flex-shrink-0">
      <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl sticky top-8">
        <h3 className="text-xl font-bold text-white mb-1">Your Selection</h3>
        <p className="text-sm text-gray-400 mb-6">Review your seats</p>

        {/* List of Seats */}
        <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar">
          {selectedSeats.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-white/10 rounded-lg text-gray-500 text-sm">
              No seats selected
            </div>
          ) : (
            selectedSeats.map((seat) => (
              <div
                key={seat.id}
                className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 animate-in slide-in-from-left-2 fade-in"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 text-xs font-bold">
                    {seat.id}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium capitalize">
                      {seat.type}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Row {seat.row}
                    </span>
                  </div>
                </div>
                <span className="text-white font-mono font-bold">
                  ${seat.price}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-4 space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-gray-400">Total Amount</span>
            <span className="text-3xl font-bold text-white">${total}</span>
          </div>

          <button
            disabled={selectedSeats.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg
              ${
                selectedSeats.length > 0
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/25"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
}
