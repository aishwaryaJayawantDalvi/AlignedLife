import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

const ReadinessGate = () => {
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await api.get("/profile/me");
        setHasProfile(Boolean(data));
      } catch {
        setHasProfile(false);
      } finally {
        setChecking(false);
      }
    };

    run();
  }, [location.pathname]);

  if (checking) return <div className="p-8">Checking your setup...</div>;

  if (!user?.acceptedRealityCheck && location.pathname !== "/reality-check") {
    return <Navigate to="/reality-check" replace />;
  }

  if (!hasProfile && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

export default ReadinessGate;
