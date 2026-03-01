import { useState } from "react";

export function BookedCard({ seat }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(seat.confirmCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-emerald-500 opacity-40" />
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-800">
            <SeatIcon className="w-5 h-5 text-emerald-400" />
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
          <div className="text-[9px] text-zinc-600 tracking-widest">PAID</div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400 tracking-widest">
            CONFIRMED
          </span>
          <span className="text-[10px] text-zinc-600">· {seat.date}</span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all duration-200"
        >
          <span className="text-[10px] font-bold tracking-widest text-zinc-300 font-mono">
            {copied ? "COPIED!" : seat.confirmCode}
          </span>
          {!copied && (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3 h-3 text-zinc-500"
            >
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </svg>
          )}
        </button>
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

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const PlaneIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);
