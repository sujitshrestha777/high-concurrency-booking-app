"use client";

import { createContext, useContext, useEffect, useState } from "react";
type LockDataType = {
  seatId: string;
  class: string;
  price: number;
  expiresAt: number;
};
type LockContextType = {
  lock: LockDataType | null;
  loading: boolean;
  saveLock: (lockData: LockDataType) => void;
  clearLock: () => void;
};
const LockContext = createContext<LockContextType | null>(null);

export function LockProvider({ children }) {
  const [lock, setLock] = useState<LockDataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const stored = sessionStorage.getItem("lockData");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.expiresAt > Date.now()) {
          setLock(parsed);
          setLoading(false);
          return;
        } else {
          sessionStorage.removeItem("lockData");
        }
      }
    };
    init();
  }, []);

  const saveLock = (lockData: LockDataType) => {
    setLock(lockData);
  };
  const clearLock = () => {
    sessionStorage.removeItem("lockData");
    setLock(null);
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
