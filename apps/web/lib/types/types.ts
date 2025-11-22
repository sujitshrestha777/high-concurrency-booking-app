export type SeatType = "business" | "economy";
export type SeatStatus = "available" | "selected" | "booked";

export interface SeatData {
  id: string;
  row: number;
  col: string;
  type: SeatType;
  status: SeatStatus;
  price: number;
}

export interface SeatRow {
  rowNumber: number;
  leftSeats: SeatData[];
  rightSeats: SeatData[];
}