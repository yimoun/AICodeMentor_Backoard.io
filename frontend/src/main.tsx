import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import NotFound from "./components/NotFound";
import ProtectedRoutes from "./components/ProtectedRoutes"; 
import App from "./components/App";
import HomePage from "./pages/HomePage";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import ChatPage from "./pages/ChatPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* <Route path="" element={<ProtectedRoutes />}>
            <Route path="user-edit/me" element={<UserEditView />} />
            <Route path="password-edit/me" element={<PasswordEditView />} />
          </Route> */}
          <Route path="" element={<HomePage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>

        {/* Routes d'authentification */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* <Route path="logout" element={<Logout />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);