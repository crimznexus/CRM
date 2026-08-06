import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useTheme } from "../context/ThemeContext";
import Footer from "./Footer";
 const TITLE_MAP = [
  { match: "/dashboard", title: "Dashboard" },
  { match: "/leads/new", title: "Add Lead" },
  { match: "/leads/", title: "Lead Details" }, // covers /leads/:id and /leads/:id/edit
  { match: "/leads", title: "All Leads" },
  { match: "/lead-discovery", title: "Google Maps Lead Finder" },
  { match: "/pipeline", title: "Pipeline" },
  { match: "/followups", title: "Follow-ups" },
  { match: "/lead-groups", title: "Lead Groups" },
  { match: "/reports", title: "Reports" },
  { match: "/team", title: "Team" },
  { match: "/settings", title: "Settings" },
];
 
function getTitleForPath(pathname) {
  const found = TITLE_MAP.find((t) => pathname.startsWith(t.match));
  return found?.title || "Dashboard";
}
 
export default function DashboardLayout() {
  const location = useLocation();
  const { isDark } = useTheme();
  const title = getTitleForPath(location.pathname);
 
  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} />
        <main className={`flex-1 p-8 transition-colors duration-200 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
