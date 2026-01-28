import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/StudentsPage";
import RiskPage from "./pages/RiskPage";
import UploadStudent from "./pages/UploadStudent"; // ✅ ADD

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/risk"
          element={
            <ProtectedRoute>
              <RiskPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ UPLOAD ROUTE */}
        <Route
          path="/upload-students"
          element={
            <ProtectedRoute>
              <UploadStudent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
    
    
  );
}

export default App;
