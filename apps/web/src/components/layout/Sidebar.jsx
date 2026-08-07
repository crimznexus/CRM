import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
  LayoutGrid,
  Users,
  MapPin,
  GitBranch,
  CalendarClock,
  FolderKanban,
  BarChart3,
  UsersRound,
  Settings,
  LogOut,
} from "lucide-react";
import authService from "../../services/authService";
import logo from "../../assets/logo.png";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutGrid },
  { label: "Leads", to: "/leads", icon: Users },
  { label: "Lead Discovery", to: "/lead-discovery", icon: MapPin },
  { label: "Pipeline", to: "/pipeline", icon: GitBranch },
  { label: "Follow-ups", to: "/followups", icon: CalendarClock },
  { label: "Lead Groups", to: "/lead-groups", icon: FolderKanban },
  { label: "Reports", to: "/reports", icon: BarChart3 },
  { label: "Team", to: "/team", icon: UsersRound },
  { label: "Settings", to: "/settings", icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleSignout = async () => {
    await authService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className={`sticky top-0 flex h-screen w-56 shrink-0 flex-col ${isDark ? "bg-slate-900 text-slate-100" : "bg-[#162b55] text-white"}`}>
      <div className="px-5 py-7">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
            <img src={logo} alt="Wessmaa" className="h-7 w-7 object-contain" />
          </div>
          <h1 className="text-sm font-bold tracking-tight">Wessmaa</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition ${
                isActive
                  ? "bg-[#e86f00] text-white shadow-sm"
                  : isDark
                    ? "text-slate-300 hover:bg-white/10"
                    : "text-white/85 hover:bg-white/10"
              }`
            }
          >
            <Icon size={15} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-5">
        <button
          onClick={handleSignout}
          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-[11px] font-bold transition ${isDark ? "text-slate-100 hover:bg-white/10" : "text-white hover:bg-white/10"}`}
        >
          Sign out
          <LogOut size={16} strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}
