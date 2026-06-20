import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import IdeaFeed from './pages/IdeaFeed';
import SubmitIdea from './pages/SubmitIdea';
import LeadershipPanel from './pages/LeadershipPanel';
import AdminMetrics from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute requiredRole="EMPLOYEE"><IdeaFeed /></ProtectedRoute>} />
          <Route path="/submit-idea" element={<ProtectedRoute requiredRole="EMPLOYEE"><SubmitIdea /></ProtectedRoute>} />

          <Route path="/admin/ideas" element={<ProtectedRoute requiredRole="ADMIN"><LeadershipPanel /></ProtectedRoute>} />
          <Route path="/admin/metrics" element={<ProtectedRoute requiredRole="ADMIN"><AdminMetrics /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;