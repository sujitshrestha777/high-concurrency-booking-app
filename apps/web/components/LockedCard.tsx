export function LockedCard({ seat, onRelease }) {
  const urgent = parseInt(seat.expiresIn) < 5;
  return (
    <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 transition-all duration-300 group overflow-hidden">
      <div
        className={`absolute top-0 left-0 right-0 h-px ${urgent ? "bg-red-500" : "bg-amber-400"} opacity-60`}
      />
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${urgent ? "bg-red-950 border border-red-800" : "bg-amber-950 border border-amber-800"}`}
          >
            <SeatIcon
              className={`w-5 h-5 ${urgent ? "text-red-400" : "text-amber-400"}`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl text-white tracking-widest">
                Seat {seat.seatId}
              </span>
              <span
                className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full ${seat.class === "Business" ? "bg-amber-400 text-black" : "bg-zinc-700 text-zinc-300"}`}
              >
                {seat.class.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <PlaneIcon className="w-3 h-3 text-zinc-500" />
              <span className="text-[11px] text-zinc-500 tracking-wider">
                {seat.flight} · {seat.route}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl text-white">
            ${seat.price.toFixed(2)}
          </div>
          <div className="text-[9px] text-zinc-600 tracking-widest">
            SEAT FEE
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <LockIcon
            className={`w-3.5 h-3.5 ${urgent ? "text-red-400" : "text-amber-400"}`}
          />
          <span
            className={`text-[10px] font-bold tracking-widest ${urgent ? "text-red-400" : "text-amber-400"}`}
          >
            EXPIRES IN {seat.expiresIn}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600">{seat.date}</span>
          <button
            onClick={() => onRelease(seat.id)}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 hover:border-red-800 border border-zinc-700 transition-all duration-200 group/btn"
          >
            <TrashIcon className="w-3.5 h-3.5 text-zinc-500 group-hover/btn:text-red-400 transition-colors" />
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-[10px] font-bold tracking-widest uppercase transition-all duration-200">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
const SeatIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path
      d="M19 13V19H5V13C5 11.9 5.9 11 7 11H17C18.1 11 19 11.9 19 13Z"
      opacity="0.5"
    />
    <path d="M4 19H20V21H4V19Z" />
    <path d="M7 4C7 2.9 7.9 2 9 2H15C16.1 2 17 2.9 17 4V11H7V4Z" />
  </svg>
);

const LockIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </svg>
);

const PlaneIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);
