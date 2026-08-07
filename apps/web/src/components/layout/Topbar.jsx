import NotificationBell from "./NotificationBell";
import { useTheme } from "../../context/ThemeContext";

export default function Topbar({ title = "Dashboard" }) {
  const { isDark } = useTheme();

  return (
    <header className={`flex h-16 items-center justify-between border-b px-6 shadow-[0_1px_0_rgba(15,23,42,0.03)] backdrop-blur ${isDark ? "border-slate-800 bg-slate-950/95" : "border-slate-200 bg-white/95"}`}>
      <div>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${isDark ? "text-slate-400" : "text-slate-400"}`}>Workspace</p>
        <h1 className={`text-base font-extrabold ${isDark ? "text-slate-100" : "text-[#172b4d]"}`}>{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell />
      </div>
    </header>
  );
}
