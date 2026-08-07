export default function StatCard({ label, value, accent = "border-slate-200", valueColor = "text-slate-900", darkMode = false }) {
  return (
    <div className={`rounded-2xl border bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200"} ${accent}`}>
      <p className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] ${darkMode ? "text-slate-400" : "text-slate-400"}`}>
        {label}
      </p>
      <p className={`text-3xl font-extrabold ${valueColor} ${darkMode ? "text-slate-100" : valueColor}`}>{value}</p>
    </div>
  );
}