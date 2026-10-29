import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';

import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Breadcrumbs } from './components/layout/Breadcrumbs';
import { Footer } from './components/layout/Footer';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { AiAssistantDrawer } from './components/ai/AiAssistantDrawer';
import { EmailPreviewModal } from './components/ui/EmailPreviewModal';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ApplicationsList } from './pages/ApplicationsList';
import { ApplicationDetail } from './pages/ApplicationDetail';
import { NewApplication } from './pages/NewApplication';
import { DocumentsList } from './pages/DocumentsList';
import { InspectionsList } from './pages/InspectionsList';
import { ComplianceList } from './pages/ComplianceList';
import { TasksList } from './pages/TasksList';
import { InstitutionsList } from './pages/InstitutionsList';
import { Reports } from './pages/Reports';
import { AuditLogs } from './pages/AuditLogs';
import { AdminSettings } from './pages/AdminSettings';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aiOpen, setAiOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { simulatedEmail, closeSimulatedEmail } = useNotifications();

  return (
    <div className="min-h-screen flex flex-col bg-gov-surface">
      <Header
        onToggleAi={() => setAiOpen(true)}
        onToggleNotifications={() => setNotifOpen(true)}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      <div className="flex-1 flex min-w-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 flex flex-col min-w-0">
          <Breadcrumbs />
          <div className="p-4 md:p-6 flex-1">{children}</div>
        </main>
      </div>

      <Footer />

      {/* Slide-over Drawers and Modals */}
      <AiAssistantDrawer isOpen={aiOpen} onClose={() => setAiOpen(false)} />
      <NotificationDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
      {simulatedEmail && (
        <EmailPreviewModal
          isOpen={!!simulatedEmail}
          onClose={closeSimulatedEmail}
          to={simulatedEmail.to}
          subject={simulatedEmail.subject}
          body={simulatedEmail.body}
          date={simulatedEmail.date}
        />
      )}
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-slate-500">
        {t('appLoading')}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* 1. Public Landing / Overview Page (AnumatiSetu Features & Novelties) */}
      <Route path="/" element={<Landing />} />

      {/* 2. Dedicated Separate Login Page with 7 Roles Directory */}
      <Route path="/login" element={<Login />} />

      {/* 3. Authenticated Workbench Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <ApplicationsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications/new"
        element={
          <ProtectedRoute>
            <NewApplication />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications/:id"
        element={
          <ProtectedRoute>
            <ApplicationDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <DocumentsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inspections"
        element={
          <ProtectedRoute>
            <InspectionsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/compliance"
        element={
          <ProtectedRoute>
            <ComplianceList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TasksList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/institutions"
        element={
          <ProtectedRoute>
            <InstitutionsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit-logs"
        element={
          <ProtectedRoute>
            <AuditLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <NotificationProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </NotificationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
