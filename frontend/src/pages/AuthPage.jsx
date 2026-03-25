import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", username: "", realName: "", isAnonymous: true });
  const [error, setError] = useState("");
  const googleBtnRef = useRef(null);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const routeAfterAuth = async (signedInUser) => {
    if (!signedInUser?.acceptedRealityCheck) {
      navigate("/reality-check");
      return;
    }

    try {
      const { data } = await api.get("/profile/me");
      navigate(data ? "/dashboard" : "/onboarding");
    } catch {
      navigate("/onboarding");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const signedInUser = await login(form, mode);
      await routeAfterAuth(signedInUser);
    } catch (e) {
      setError(e.response?.data?.message || "Authentication failed");
    }
  };

  useEffect(() => {
    if (!googleClientId || !googleBtnRef.current) return;

    const setupGoogle = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          try {
            setError("");
            const signedInUser = await loginWithGoogle(response.credential);
            await routeAfterAuth(signedInUser);
          } catch (e) {
            setError(e.response?.data?.message || "Google sign-in failed");
          }
        }
      });

      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        type: "standard",
        shape: "rectangular",
        text: "continue_with",
        width: 360
      });
    };

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      setupGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = setupGoogle;
    document.body.appendChild(script);
  }, [googleClientId, loginWithGoogle, navigate]);

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-7 border border-slate-700/80 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Private Access</p>
        <h1 className="text-3xl font-extrabold mt-2">{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p className="text-slate-400 text-sm mt-2">
          Built for life alignment and privacy-first conversations.
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-900/80 border border-slate-700 p-1">
          <button
            type="button"
            className={`rounded-lg py-2 text-sm font-semibold transition ${mode === "login" ? "bg-glow text-ink" : "text-slate-300 hover:bg-slate-800"}`}
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`rounded-lg py-2 text-sm font-semibold transition ${mode === "signup" ? "bg-glow text-ink" : "text-slate-300 hover:bg-slate-800"}`}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <input
            className="input"
            placeholder="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {mode === "signup" && (
            <>
              <input
                className="input"
                placeholder="Username (public)"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              <input
                className="input"
                placeholder="Real name (optional)"
                value={form.realName}
                onChange={(e) => setForm({ ...form, realName: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm text-slate-300 pt-1">
                <input
                  type="checkbox"
                  checked={form.isAnonymous}
                  onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                />
                Stay anonymous until mutual reveal
              </label>
            </>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button className="btn-primary w-full py-3">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        {googleClientId && (
          <div className="mt-6">
            <div className="relative text-center">
              <div className="border-t border-slate-700" />
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-mist px-2 text-xs text-slate-400">
                or continue with Google
              </span>
            </div>
            <div className="mt-4 flex justify-center">
              <div ref={googleBtnRef} className="min-h-10" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
