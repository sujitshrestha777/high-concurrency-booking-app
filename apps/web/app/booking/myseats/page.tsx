"use client";
import { LockedCard } from "components/LockedCard";
import { StatCard } from "components/StateCard";
import { LockDataType, useLock } from "context/SeatLockcontext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const lockedSeats = [
  {
    id: "LS-001",
    seatId: "12C",
    class: "Economy",
    price: 45.0,
    flight: "BA 0178",
    route: "JFK → LHR",
    date: "03 MAR 2026",
    expiresIn: "12:32",
    status: "locked",
  },
  {
    id: "LS-002",
    seatId: "3A",
    class: "Business",
    price: 320.0,
    flight: "EK 201",
    route: "LHR → DXB",
    date: "05 MAR 2026",
    expiresIn: "02:11",
    status: "locked",
  },
];

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

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const Spinner = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-14">
    <div className="w-6 h-6 border-2 border-zinc-800 border-t-emerald-400 rounded-full animate-spin" />
    <span className="text-[10px] text-zinc-600 tracking-widest uppercase">
      Loading seats…
    </span>
  </div>
);

const CLASS_PRICE = { ECONOMY: 100, BUSINESS: 250 };

export default function MySeats() {
  const [locks, setLocks] = useState<LockDataType[] | []>([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { lock, clearLock } = useLock();

  const totalLocked = locks.length;
  const totalBooked = bookedSeats.length;
  const totalSpent = bookedSeats.reduce(
    (s, b) => s + (CLASS_PRICE[b.classType] ?? 0),
    0,
  );
  const totalHeld = locks.reduce((s, l) => s + l.price, 0);

  const releaseHold = (id, seatId: string) => {
    setLocks((prev) => prev.filter((s) => s.id !== id));
    clearLock(seatId);
  };

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/booking/mybookedseat", {
          method: "GET",
        });
        if (response.status === 401) {
          router.push("/auth/sign-in");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? `Server error ${response.status}`);
        }

        if (data.success && Array.isArray(data.bookedSeats)) {
          setBookedSeats(data.bookedSeats);
        } else {
          throw new Error(data.message ?? "Unexpected response from server");
        }
      } catch (err) {
        setError(err?.message ?? "Failed to load booked seats");
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSeats();
  }, []);

  useEffect(() => {
    const localStorageLockedseats = localStorage.getItem("lockData");
    // console.log("localstoratelockdedseat", localStorageLockedseats);
    console.log("localstoratelockdedseat", lock);

    setLocks(lock);
  }, [lock]);
  useEffect(() => {
    console.log("locks state in the myseats", locks);
  }, [locks]);

  return (
    <div className="min-h-screen bg-[#000000] font-mono-custom">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-mono-custom { font-family: 'Space Mono', monospace; }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-amber {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-slide-up   { animation: slide-up 0.5s ease both; }
        .animate-slide-up-2 { animation: slide-up 0.5s 0.1s ease both; }
        .animate-slide-up-3 { animation: slide-up 0.5s 0.2s ease both; }
        .animate-pulse-amber { animation: pulse-amber 2s infinite; }
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="noise fixed inset-0 pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* ── Header ── */}
        <div className="animate-slide-up mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-5xl text-white tracking-widest leading-none">
                MY SEATS
              </div>
              <div className="text-zinc-500 text-[10px] tracking-[0.4em] uppercase mt-1">
                Holds & Bookings
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {totalLocked > 0 && (
                <div className="flex items-center gap-1.5 bg-amber-950 border border-amber-800 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-amber" />
                  <span className="text-[10px] text-amber-400 font-bold tracking-widest">
                    {totalLocked} ACTIVE HOLD{totalLocked > 1 ? "S" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* ── LEFT SIDEBAR ── */}
          <aside className="w-full lg:w-48 lg:flex-shrink-0 animate-slide-up-2">
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
              <StatCard
                label="Held"
                value={totalLocked}
                sub={`$${totalHeld.toFixed(0)} pending`}
                accent="text-amber-400"
              />
              <StatCard
                label="Booked"
                value={loading ? "—" : totalBooked}
                sub={loading ? "loading…" : `${totalBooked} confirmed`}
                accent="text-emerald-400"
              />
              <StatCard
                label="Total Spent"
                value={loading ? "—" : `$${totalSpent.toFixed(0)}`}
                sub="on seat fees"
                accent=""
              />
            </div>

            {/* Legend — desktop only */}
            <div className="hidden lg:flex flex-col gap-2 mt-5 pt-5 border-t border-zinc-800">
              {[
                { color: "bg-amber-400", label: "Held" },
                { color: "bg-emerald-400", label: "Booked" },
                { color: "bg-red-400", label: "Urgent" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
                  <span className="text-[9px] text-zinc-600 tracking-widest uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </aside>

          {/* ── RIGHT MAIN ── */}
          <main className="flex-1  animate-slide-up-3">
            {/* ── Held Seats ── */}
            {(activeFilter === "all" || activeFilter === "locked") &&
              locks.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <LockIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] text-amber-400 tracking-[0.3em] uppercase font-bold">
                      Held Seats
                    </span>
                    <div className="h-px flex-1 bg-zinc-800" />
                  </div>
                  <div className="flex flex-col gap-3">
                    {locks.map((seat) => (
                      <LockedCard
                        key={seat.seatId}
                        seat={seat}
                        onRelease={releaseHold}
                      />
                    ))}
                  </div>
                </div>
              )}

            {/* Empty held state */}
            {(activeFilter === "all" || activeFilter === "locked") &&
              locks.length === 0 && (
                <div className="mb-6 bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3">
                  <SeatIcon className="w-8 h-8 text-zinc-700" />
                  <span className="text-[11px] text-zinc-600 tracking-widest">
                    NO ACTIVE HOLDS
                  </span>
                </div>
              )}

            {/* ── Booked Seats ── */}
            {(activeFilter === "all" || activeFilter === "booked") && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 tracking-[0.3em] uppercase font-bold">
                    Booked Seats
                  </span>
                  <div className="h-px flex-1 bg-zinc-800" />
                </div>

                {/* Loading */}
                {loading && <Spinner />}

                {/* Error */}
                {!loading && error && (
                  <div className="bg-zinc-900 border border-red-900/60 rounded-2xl p-8 flex flex-col items-center gap-3">
                    <span className="text-[11px] text-red-400 tracking-widest uppercase">
                      Failed to load
                    </span>
                    <span className="text-[10px] text-zinc-600 text-center max-w-xs">
                      {error}
                    </span>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-1 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[10px] text-zinc-300 tracking-widest uppercase transition-all duration-200"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Empty */}
                {!loading && !error && bookedSeats.length === 0 && (
                  <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3">
                    <SeatIcon className="w-8 h-8 text-zinc-700" />
                    <span className="text-[11px] text-zinc-600 tracking-widest">
                      NO BOOKED SEATS
                    </span>
                  </div>
                )}

                {/* Cards */}
                {!loading && !error && bookedSeats.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {bookedSeats.map((seat, i) => {
                      const isBusiness = seat.classType === "BUSINESS";
                      const price = CLASS_PRICE[seat.classType] ?? 0;
                      return (
                        <div
                          key={seat.seatId ?? i}
                          className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 transition-all duration-300 overflow-hidden"
                        >
                          {/* top glow strip */}
                          <div className="absolute top-0 left-0 right-0 h-px bg-emerald-500 opacity-40" />

                          <div className="flex items-start justify-between">
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
                                    className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full ${
                                      isBusiness
                                        ? "bg-amber-400 text-black"
                                        : "bg-zinc-700 text-zinc-300"
                                    }`}
                                  >
                                    {seat.classType}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-display text-2xl text-white">
                                ${price}
                              </div>
                              <div className="text-[9px] text-zinc-600 tracking-widest">
                                PAID
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-zinc-800">
                            <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-400 tracking-widest">
                              CONFIRMED
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
