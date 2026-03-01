export function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-1 w-full">
      <span className="text-[10px] text-zinc-500 tracking-[0.25em] uppercase">
        {label}
      </span>
      <span
        className={`font-display text-3xl tracking-wider ${accent || "text-white"}`}
      >
        {value}
      </span>
      {sub && <span className="text-[10px] text-zinc-600">{sub}</span>}
    </div>
  );
}
