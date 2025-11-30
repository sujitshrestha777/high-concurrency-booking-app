// src/types.ts
export interface SeatUpdate {
  seatId: string;
  status: 'available' | 'reserved' | 'booked';
  eventId: string;
}