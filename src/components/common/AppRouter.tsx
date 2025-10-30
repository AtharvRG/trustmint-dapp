// src/components/common/AppRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useWeb3 } from '../../hooks/useWeb3';
import { useUser } from '../../hooks/useUser';
import HomePage from '../../pages/HomePage';
import OnboardingPage from '../../pages/OnboardingPage';
import StartProjectPage from '../../pages/StartProjectPage'; // Import the new hub
import DirectHirePage from '../../pages/DirectHirePage'; 
import ProjectPage from '../../pages/ProjectPage';
import DashboardPage from '../../pages/DashboardPage'; // Import the real component
import ProfilePage from '../../pages/ProfilePage';
import MarketplacePage from '../../pages/MarketplacePage';
import JobDetailsPage from '../../pages/JobDetailsPage';
import PostJobPage from '../../pages/PostJobPage';

export const AppRouter = () => {
  const { isConnected } = useWeb3();
  const { profile, loadingProfile } = useUser();

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (isConnected && !profile) {
    return (
      <Routes>
        <Route path="/welcome" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/welcome" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/project/:address" element={<ProjectPage />} />
      <Route path="/market" element={<MarketplacePage />} />
      <Route path="/market/job/:id" element={<JobDetailsPage />} />
      
      {isConnected && profile && (
        <>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Client-only routes */}
          {profile.role === 1 /* Client */ && (
            <>
              {/* This is the new hub page */}
              <Route path="/create" element={<StartProjectPage />} /> 
              {/* This is the old form, now at a specific path */}
              <Route path="/create/direct" element={<DirectHirePage />} />
              {/* The marketplace job posting page */}
              <Route path="/market/post-job" element={<PostJobPage />} />
            </>
          )}
        </>
      )}

      {isConnected && profile && <Route path="/welcome" element={<Navigate to="/dashboard" />} />}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;