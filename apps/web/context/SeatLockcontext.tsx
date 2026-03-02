"use client";

import { createContext, useContext, useEffect, useState } from "react";
export type LockDataType = {
  seatId: string;
  class: string;
  price: number;
  expiresAt: number;
};
type LockContextType = {
  lock: LockDataType[] | [];
  loading: boolean;
  saveLock: (lockData: LockDataType) => void;
  clearLock: () => void;
};
const LockContext = createContext<LockContextType | null>(null);

export function LockProvider({ children }) {
  const [lock, setLock] = useState<LockDataType[] | []>([]);
  const [loading, setLoading] = useState(true);
  type lockSeatType = {
    seatId: string;
    class: "business" | "economy";
    price: number;
    expiresAt: number;
  };

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem("lockData");
      console.log(
        "stored data in localsttoreage in the items while init()",
        stored,
      );
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("inside parsed expired", parsed);
        const validData = parsed.filter(
          (lockseat: lockSeatType) => lockseat.expiresAt > Date.now(),
        );
        localStorage.setItem("lockData", JSON.stringify(validData));
        console.log("valid data", validData);
        setLock(validData);
      }
    };
    init();
  }, []);

  useEffect(() => {
    console.log("The lock state has updated to:", lock);
  }, [lock]);

  const saveLock = (lockData: LockDataType) => {
    const raw = localStorage.getItem("lockData");
    console.log("existing raw data:", raw);
    let existingSeats = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(existingSeats)) {
      existingSeats = [existingSeats];
    }

    console.log("existing seat locks", existingSeats);

    existingSeats.push(lockData);

    console.log("combined existing seats", existingSeats);

    localStorage.setItem("lockData", JSON.stringify(existingSeats));
    setLock(existingSeats);
  };

  const clearLock = () => {
    // localStorage.removeItem("lockData");
    setLock([]);
  };

  return (
    <LockContext.Provider value={{ lock, loading, saveLock, clearLock }}>
      {children}
    </LockContext.Provider>
  );
}

export function useLock() {
  const context = useContext(LockContext);
  if (!context) {
    throw new Error("useLock must be used inside LockProvider");
  }

  return context;
}
