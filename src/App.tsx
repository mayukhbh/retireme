import type React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import LandingPage from './pages/LandingPage';
import PlannerPage from './pages/PlannerPage';
import DashboardPage from './pages/DashboardPage';
import PageShell from './components/layout/PageShell';
import FanPage from './fan/FanPage';

// "/" is the new single-screen planner. The older wizard stays reachable at /classic,
// /planner and /dashboard until the engine port replaces its API calls, then it can go.
const shell = (el: React.ReactNode) => <PageShell>{el}</PageShell>;

function App() {
  return (
    <ProfileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<FanPage />} />
          <Route path="/classic" element={shell(<LandingPage />)} />
          <Route path="/planner" element={shell(<PlannerPage />)} />
          <Route path="/dashboard" element={shell(<DashboardPage />)} />
        </Routes>
      </Router>
    </ProfileProvider>
  );
}

export default App;
