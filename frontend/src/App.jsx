import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import ReadinessGate from "./components/ReadinessGate";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import RealityCheckPage from "./pages/RealityCheckPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";
import AgreementBuilderPage from "./pages/AgreementBuilderPage";

const App = () => {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/reality-check" element={<RealityCheckPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            <Route element={<ReadinessGate />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chat/:matchId/:partnerId" element={<ChatPage />} />
              <Route path="/agreement" element={<AgreementBuilderPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
};

export default App;
