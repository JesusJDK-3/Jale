import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ChatPage } from "./pages/ChatPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DesignSystemPage } from "./pages/DesignSystemPage";
import { ExplorePage } from "./pages/ExplorePage";
import { LandingPage } from "./pages/LandingPage";
import { RoleSelectPage } from "./pages/RoleSelectPage";
import { StudentDetailPage } from "./pages/StudentDetailPage";
import { StudentDocumentPage } from "./pages/StudentDocumentPage";
import { StudentPendingPage } from "./pages/StudentPendingPage";
import { StudentProfilePage } from "./pages/StudentProfilePage";
import { StudentRegisterPage } from "./pages/StudentRegisterPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sistema-de-diseno" element={<DesignSystemPage />} />
        <Route path="/explorar" element={<ExplorePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/panel" element={<DashboardPage />} />
        <Route path="/estudiante/:id" element={<StudentDetailPage />} />
        <Route path="/perfil/:id" element={<StudentDetailPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/onboarding" element={<RoleSelectPage />} />
        <Route path="/onboarding/estudiante" element={<StudentRegisterPage />} />
        <Route path="/onboarding/estudiante/carne" element={<StudentDocumentPage />} />
        <Route path="/onboarding/estudiante/verificacion" element={<StudentPendingPage />} />
        <Route path="/onboarding/estudiante/perfil" element={<StudentProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
