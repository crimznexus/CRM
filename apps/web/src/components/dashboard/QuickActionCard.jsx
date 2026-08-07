export default function QuickActionCard({ icon: Icon, label, iconBg, iconColor, onClick, darkMode = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border py-8 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: iconBg }}>
        <Icon size={22} style={{ color: iconColor }} strokeWidth={2} />
      </div>
      <span className={`text-sm font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{label}</span>
    </button>
  );
}