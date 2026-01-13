
// // VERSION AVEC PROTECTION DES ROUTES (si tu veux l'utiliser plus tard)

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
// import NotFound from "./components/NotFound";
// import ProtectedRoutes from "./components/ProtectedRoutes"; 
// import HomePage from "./pages/HomePage";
// import LoginPage from "./components/auth/LoginPage";
// import SignupPage from "./components/auth/SignupPage";
// import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
// import AppLayout from "./components/layouts/AppLayout";
// import HomeLayout from "./components/layouts/HomeLayout";
// import SettingsContent from "./pages/SettingsContent";
// import DashboardContent from "./pages/DashboardContent";
// import ChatContent from "./pages/ChatContent";

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <BrowserRouter>
//       <Routes>
//         {/* ========================================
//             ROUTES PUBLIQUES (avec HomeLayout)
//         ======================================== */}
//         <Route path="/" element={<HomeLayout />}>
//           <Route index element={<HomePage />} />
//         </Route>

//         {/* ========================================
//             ROUTES D'AUTHENTIFICATION (sans layout)
//         ======================================== */}
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/forgot-password" element={<ForgotPasswordPage />} />

//         {/* ========================================
//             ROUTES PROTÉGÉES (vérifie auth avant)
//         ======================================== */}
//         <Route element={<ProtectedRoutes />}>
//           <Route path="/app" element={<AppLayout />}>
//             <Route index element={<Navigate to="/app/chat" replace />} />
//             <Route path="chat" element={<ChatContent />} />
//             <Route path="dashboard" element={<DashboardContent />} />
//             <Route path="settings" element={<SettingsContent />} />
//           </Route>
//         </Route>

//         {/* ========================================
//             FALLBACK
//         ======================================== */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//   </StrictMode>
// );