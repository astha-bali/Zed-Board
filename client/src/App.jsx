import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import BoardPage from './pages/BoardPage';
import BacklogPage from './pages/BacklogPage';
import SettingsPage from './pages/SettingsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PointTargetsPage from './pages/PointTargetsPage';
import IssueListPage from './pages/IssueListPage';
import ProfilePage from './pages/ProfilePage';

import './index.css';
import './styles/layout.css';
import './styles/auth.css';
import './styles/board.css';
import './styles/components.css';
import './styles/dashboard.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage defaultRole="member" />} />
            <Route path="/register/admin" element={<RegisterPage defaultRole="admin" />} />

            {/* Protected */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
              <Route path="project/:projectId/board" element={<BoardPage />} />
              <Route path="project/:projectId/issues" element={<IssueListPage />} />
              <Route path="project/:projectId/backlog" element={<BacklogPage />} />
              <Route path="project/:projectId/settings" element={<SettingsPage />} />
              <Route path="project/:projectId/targets" element={<AdminRoute><PointTargetsPage /></AdminRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
