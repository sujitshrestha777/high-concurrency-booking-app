// apps/web/app/booking/[flightId]/page.tsx
import SeatMap from "../../components/Seats";

// Fake/mock data for now — ideally fetch from DB
const getSeats = async () => {
  // Mock 4 business + 12 economy seats
  return [
    { id: "b1", seatNumber: "1A", type: "BUSINESS", isBooked: false },
    { id: "b2", seatNumber: "1B", type: "BUSINESS", isBooked: true },
    { id: "b3", seatNumber: "1C", type: "BUSINESS", isBooked: false },
    { id: "b4", seatNumber: "1D", type: "BUSINESS", isBooked: false },

    { id: "e1", seatNumber: "4A", type: "ECONOMY", isBooked: false },
    { id: "e2", seatNumber: "4B", type: "ECONOMY", isBooked: false },
    { id: "e3", seatNumber: "4C", type: "ECONOMY", isBooked: true },
    { id: "e4", seatNumber: "4D", type: "ECONOMY", isBooked: false },
    { id: "e5", seatNumber: "4E", type: "ECONOMY", isBooked: false },
    { id: "e6", seatNumber: "4F", type: "ECONOMY", isBooked: true },
    // ...more seats
  ];
};

export default async function BookingPage() {
  const seats = await getSeats();
  console.log(seats);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Select Your Seat for Flight
      </h1>
      <SeatMap />
    </div>
  );
}
