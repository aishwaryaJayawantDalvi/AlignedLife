import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const RealityCheckPage = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    const routeIfAlreadyAccepted = async () => {
      if (!user?.acceptedRealityCheck) return;

      try {
        const { data } = await api.get("/profile/me");
        navigate(data ? "/dashboard" : "/onboarding", { replace: true });
      } catch {
        navigate("/onboarding", { replace: true });
      }
    };

    routeIfAlreadyAccepted();
  }, [navigate, user?.acceptedRealityCheck]);

  const accept = async () => {
    await api.post("/users/reality-check/accept");
    await refreshUser();
    navigate("/onboarding");
  };

  return (
    <div className="max-w-2xl mx-auto card p-8">
      <h1 className="text-2xl font-bold">Reality Check</h1>
      <div className="mt-4 space-y-3 text-slate-300">
        <p>Marriage has legal and social implications that vary by country and state.</p>
        <p>Divorce or separation can become complex and emotionally difficult.</p>
        <p>People may change their priorities over time, even with good intentions.</p>
      </div>
      <button className="btn-primary mt-6" onClick={accept}>I understand and accept</button>
    </div>
  );
};

export default RealityCheckPage;
