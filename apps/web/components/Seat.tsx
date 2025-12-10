import { useState, useEffect } from "react";

// Types
interface SeatData {
  id: string;
  status: string;
  type: string;
  position: string;
}

interface SeatRow {
  rowNumber: number;
  leftSeats: SeatData[];
  rightSeats: SeatData[];
}

interface WSMessage {
  type: string;
  data: {
    seatId: string;
    type: string;
  };
  timestamp: number;
}

// Seat Component
interface SeatProps {
  seat: SeatData;
  isSelected: boolean;
  onToggle: (seat: SeatData) => void;
  wsStatus?: string; // WebSocket status
}

export function Seat({ seat, isSelected, onToggle, wsStatus }: SeatProps) {
  const isBooked =
    seat.status === "booked" || wsStatus?.toLowerCase() === "booked";
  const isLocked = wsStatus?.toLowerCase() === "locked";

  const baseClasses =
    "group relative flex flex-col items-center justify-center p-1 sm:p-2 rounded-md transition-all duration-200 border";

  let stateClasses = "";

  // WebSocket statuses take priority
  if (isBooked) {
    stateClasses =
      "bg-red-500/30 border-red-500 opacity-70 cursor-not-allowed text-red-200";
  } else if (isLocked) {
    stateClasses =
      "bg-yellow-500/30 border-yellow-500 opacity-70 cursor-not-allowed text-yellow-200";
  } else if (isSelected) {
    stateClasses =
      "bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-110 z-10";
  } else {
    stateClasses =
      "bg-white/5 border-transparent hover:border-purple-500/30 hover:bg-white/10 text-gray-500 hover:text-purple-300 cursor-pointer";
  }

  const sizeClass =
    seat.type === "business"
      ? "w-8 h-8 sm:w-10 sm:h-10"
      : "w-6 h-6 sm:w-8 sm:h-8";

  const isClickable = !isBooked && !isLocked;

  return (
    <button
      onClick={() => isClickable && onToggle(seat)}
      disabled={!isClickable}
      className={`${baseClasses} ${stateClasses}`}
      aria-label={`Seat ${seat.id} ${wsStatus || seat.status}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`mb-1 ${sizeClass}`}
      >
        <path
          d="M19 13V19H5V13C5 11.9 5.9 11 7 11H17C18.1 11 19 11.9 19 13Z"
          opacity="0.5"
        />
        <path d="M4 19H20V21H4V19Z" />
        <path d="M7 4C7 2.9 7.9 2 9 2H15C16.1 2 17 2.9 17 4V11H7V4Z" />
      </svg>
      <span className="text-[9px] sm:text-[10px] font-bold tracking-widest">
        {seat.id}
      </span>

      {/* WebSocket status indicator */}
      {wsStatus && (
        <div
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
          style={{
            backgroundColor:
              wsStatus.toLowerCase() === "locked" ? "#eab308" : "",
          }}
        />
      )}
    </button>
  );
}
