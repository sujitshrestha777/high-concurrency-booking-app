"use client";

export default function SeatMap() {
  const businessSeats = Array.from({ length: 8 }, (_, i) => ({
    id: `B${i + 1}`,
    seatNumber: `B${i + 1}`,
    isBooked: i % 3 === 0, // simulate some booked
  }));

  const economySeats = Array.from({ length: 18 }, (_, i) => ({
    id: `E${i + 1}`,
    seatNumber: `E${i + 1}`,
    isBooked: i % 5 === 0, // simulate some booked
  }));

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-lg font-bold">Select a Seat</h2>

      {/* Business Class */}
      <div className="grid grid-cols-4 gap-3">
        {businessSeats.map((seat) => (
          <button
            key={seat.id}
            disabled={seat.isBooked}
            className={`
              w-12 h-12 rounded-md border
              ${seat.isBooked ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-400"}
            `}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full border-t border-gray-300 my-4" />

      {/* Economy Class */}
      <div className="grid grid-cols-6 gap-2">
        {economySeats.map((seat) => (
          <button
            key={seat.id}
            disabled={seat.isBooked}
            className={`
              w-10 h-10 rounded-md border
              ${seat.isBooked ? "bg-gray-400 cursor-not-allowed" : "bg-blue-400"}
            `}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>
    </div>
  );
}
