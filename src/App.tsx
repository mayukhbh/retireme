import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import LandingPage from './pages/LandingPage';
import PlannerPage from './pages/PlannerPage';
import DashboardPage from './pages/DashboardPage';
import PageShell from './components/layout/PageShell';

function App() {
  return (
    <ProfileProvider>
      <Router>
        <PageShell>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </PageShell>
      </Router>
    </ProfileProvider>
  );
}

export default App;
