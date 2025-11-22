import { SeatData, SeatRow } from "../types/types";

function createSeat(row: number, col: string, type: "business" | "economy"): SeatData {
  const price = type === "business" ? 250 : 100;
  // Randomly block seats for realism
  const isBooked = Math.random() > 0.85; 

  return {
    id: `${row}${col}`,
    row,
    col,
    type,
    price,
    status: isBooked ? "booked" : "available",
  };
}

export function generatePlaneLayout(): SeatRow[] {
  const rows: SeatRow[] = [];

  // Business: Rows 1-13 (AB - DE)
  for (let i = 1; i <= 13; i++) {
    rows.push({
      rowNumber: i,
      leftSeats: ["A", "B"].map(col => createSeat(i, col, "business")),
      rightSeats: ["D", "E"].map(col => createSeat(i, col, "business")),
    });
  }

  // Economy: Rows 14-88 (ABC - DEF)
  for (let i = 14; i <= 88; i++) {
    rows.push({
      rowNumber: i,
      leftSeats: ["A", "B", "C"].map(col => createSeat(i, col, "economy")),
      rightSeats: ["D", "E", "F"].map(col => createSeat(i, col, "economy")),
    });
  }

  return rows;
}