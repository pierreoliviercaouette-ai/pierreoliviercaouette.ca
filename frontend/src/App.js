import "@/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SupabaseAuthProvider as AuthProvider } from "./context/SupabaseAuthContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { BackToTop } from "./components/layout/BackToTop";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { AnalyticsTracker } from "./components/layout/AnalyticsTracker";

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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AnalyticsTracker />
        <div className="min-h-screen flex flex-col">
          <Navbar />
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
              <Route path="/referencement/consentement" element={<ReferralConsent />} />
              <Route path="/referencement" element={<Referral />} />
              <Route path="/confidentialite" element={<Privacy />} />
              <Route path="/conditions" element={<Terms />} />
            </Routes>
          </main>
          <Footer />
          <BackToTop />
        </div>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
