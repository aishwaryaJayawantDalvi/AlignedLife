import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const logoPremium = "/favicon.svg";

const AppShell = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-700/70 bg-[#090d12]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 rounded-xl px-1 py-1"
            aria-label="Go to homepage"
          >
            <img
              src={logoPremium}
              alt="AlignedLife Logo"
              className="h-7 w-7 object-contain transition duration-200 group-hover:scale-105 sm:h-8 sm:w-8"
            />

            <div className="text-left leading-tight">
              <p className="text-sm font-extrabold tracking-wide text-slate-100 sm:text-base">AlignedLife</p>
            </div>
          </button>

          {user && (
            <nav className="flex items-center gap-1 text-xs text-slate-200 sm:gap-3 sm:text-sm">
              <NavLink to="/dashboard" className="rounded-md px-2 py-1 transition hover:bg-slate-800 hover:text-glow">Matches</NavLink>
              <NavLink to="/agreement" className="hidden rounded-md px-2 py-1 transition hover:bg-slate-800 hover:text-glow sm:inline-block">Agreement Builder</NavLink>
              <NavLink to="/onboarding" className="hidden rounded-md px-2 py-1 transition hover:bg-slate-800 hover:text-glow sm:inline-block">Edit Profile</NavLink>
              <button onClick={logout} className="btn-muted px-3 py-1.5 text-xs sm:text-sm">Logout</button>
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
};

export default AppShell;
