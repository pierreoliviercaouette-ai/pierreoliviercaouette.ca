import "@/index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SupabaseAuthProvider as AuthProvider } from "./context/SupabaseAuthContext";
import { Navbar } from "./components/layout/Navbar";
import { ModelPortfoliosBanner } from "./components/layout/ModelPortfoliosBanner";
import { Footer } from "./components/layout/Footer";
import { BackToTop } from "./components/layout/BackToTop";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { AnalyticsTracker } from "./components/layout/AnalyticsTracker";
import { useSupabaseAuth } from "./context/SupabaseAuthContext";

// Pages
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Tools } from "./pages/Tools";
import { ToolDetail } from "./pages/ToolDetail";
import { Login, Register } from "./pages/Auth";
import { Profile } from "./pages/Profile";
import { Admin } from "./pages/Admin";
import { Contact, Appointment } from "./pages/Contact";
import { Privacy, Terms } from "./pages/Legal";
import { Referral } from "./pages/Referral";
import { ReferralConsent } from "./pages/ReferralConsent";
import { ModelPortfolioDetail } from "./pages/ModelPortfolioDetail";
import {
  AssuranceInvaliditeQuebec,
  AssuranceVieVictoriaville,
  ConseillerFinancierVictoriaville,
  PlanificationFinanciereQuebec,
  RecommanderConseillerFinancier,
} from "./pages/SeoLandingPages";

function App() {
  const { user, loading } = useSupabaseAuth();
  const isAdmin = Boolean(user?.is_admin);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnalyticsTracker />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        {isAdmin && (
          <div>
            <ModelPortfoliosBanner />
          </div>
        )}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/outils" element={<Tools />} />
            <Route path="/outils/:slug" element={<ToolDetail />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/rendez-vous" element={<Appointment />} />
            <Route path="/recommandations/consentement" element={<ReferralConsent />} />
            <Route path="/recommandations" element={<Referral />} />
            <Route
              path="/portefeuilles/:slug"
              element={loading ? null : isAdmin ? <ModelPortfolioDetail /> : <Navigate to="/" replace />}
            />
            <Route path="/referencement/consentement" element={<Navigate to="/recommandations/consentement" replace />} />
            <Route path="/referencement" element={<Navigate to="/recommandations" replace />} />
            <Route path="/conseiller-financier-victoriaville" element={<ConseillerFinancierVictoriaville />} />
            <Route path="/assurance-vie-victoriaville" element={<AssuranceVieVictoriaville />} />
            <Route path="/assurance-invalidite-quebec" element={<AssuranceInvaliditeQuebec />} />
            <Route path="/planification-financiere-quebec" element={<PlanificationFinanciereQuebec />} />
            <Route path="/recommander-conseiller-financier" element={<RecommanderConseillerFinancier />} />
            <Route path="/confidentialite" element={<Privacy />} />
            <Route path="/conditions" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
      </div>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

function AppWithProviders() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithProviders;
