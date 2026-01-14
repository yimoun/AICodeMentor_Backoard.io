import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

// Contexts
import UserProvider from "./components/contexts/UserProvider";

// Components
import NotFound from "./components/NotFound";
import ProtectedRoutes from "./components/ProtectedRoutes";

// Pages publiques
import HomePage from "./components/pages/HomePage";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import OnboardingContent from "./components/pages/OnboardingContent";

// Layouts
import AppLayout from "./components/layouts/AppLayout";
import HomeLayout from "./components/layouts/HomeLayout";

// Pages protégées
import SettingsContent from "./components/pages/SettingsContent";
import DashboardContent from "./components/pages/DashboardContent";
import ChatContent from "./components/pages/ChatContent";
import BadgesContent from "./components/pages/BadgesContent";
import PublicProfileContent from "./components/pages/PublicProfileContent";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* ========================================
        USER PROVIDER - Wrap toute l'application
        Fournit les données utilisateur partout
    ======================================== */}
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* ========================================
              ROUTES PUBLIQUES (avec HomeLayout: Navbar + Footer)
          ======================================== */}
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<HomePage />} />
            {/* Ajouter d'autres pages publiques ici si besoin */}
          </Route>

          {/* ========================================
              ROUTES D'AUTHENTIFICATION (sans layout, plein écran)
          ======================================== */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* ========================================
              ONBOARDING (protégé, mais sans AppLayout)
          ======================================== */}
          <Route path="/onboarding" element={<OnboardingContent />} />

          {/* ========================================
              ROUTES PROTÉGÉES DE L'APP (avec AppLayout: Sidebar)
          ======================================== */}
          <Route path="/app" element={<AppLayout />}>
            {/* Route index qui redirige vers /app/chat */}
            <Route index element={<Navigate to="/app/chat" replace />} />
            
            <Route path="chat" element={<ChatContent />} />
            <Route path="dashboard" element={<DashboardContent />} />
            <Route path="settings" element={<SettingsContent />} />
            <Route path="badges" element={<BadgesContent />} />
            <Route path="profile" element={<PublicProfileContent />} />
            {/* TODO: Ajouter ces pages */}
            {/* <Route path="skills" element={<SkillsContent />} /> */}
          </Route>

          {/* ========================================
              FALLBACK
          ======================================== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);