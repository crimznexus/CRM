import { Navigate, Outlet } from "react-router-dom";
import { useConvexAuth } from "convex/react";

export default function PrivateRoute() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Loading your workspace…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
