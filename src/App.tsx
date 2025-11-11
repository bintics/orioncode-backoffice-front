import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider, useSidebarContext } from './contexts/SidebarContext';
import Navigation from './components/Navigation';
import PositionsMicrofrontend from './pages/positions/PositionsMicrofrontend';
import CollaboratorsList from './pages/collaborators/CollaboratorsList';
import CollaboratorForm from './pages/collaborators/CollaboratorForm';
import TeamsList from './pages/teams/TeamsList';
import TeamForm from './pages/teams/TeamForm';
import './i18n';

const AppContent = () => {
  const { isCollapsed } = useSidebarContext();

  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className={`main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/positions" replace />} />
            
            {/* Positions Routes - Now handled by Microfrontend */}
            <Route path="/positions/*" element={<PositionsMicrofrontend />} />
            
            {/* Collaborators Routes */}
            <Route path="/collaborators" element={<CollaboratorsList />} />
            <Route path="/collaborators/new" element={<CollaboratorForm />} />
            <Route path="/collaborators/edit/:id" element={<CollaboratorForm />} />
            
            {/* Teams Routes */}
            <Route path="/teams" element={<TeamsList />} />
            <Route path="/teams/new" element={<TeamForm />} />
            <Route path="/teams/edit/:id" element={<TeamForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  return (
    <SidebarProvider>
      <AppContent />
    </SidebarProvider>
  );
}

export default App;
