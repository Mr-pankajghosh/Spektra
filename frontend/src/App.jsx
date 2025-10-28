import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import OTPVerificationPage from './pages/OTPVerification.jsx';
import LandingPage from './pages/LandingPage.jsx';
import FriendsPage from './pages/FriendsPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ContestPage from './pages/Contestpage.jsx';
import NewsPage from './pages/NewsPage.jsx';
import CommunitiesPage from './pages/CommunitiesPage.jsx';
import MyCommunitiesPage from './pages/MyCommunitiesPage.jsx';
import CommunityDetailPage from './pages/CommunityDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MyProfile from './pages/MyProfile.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import CallPage from './pages/CallPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ChatbotButton from "./components/ChatbotButton";

import Layout from './components/Layout.jsx';
import PageLoader from './components/PageLoader.jsx';

import useAuthUser from './hooks/useAuthUser.js';
import { useThemeStore } from './store/useThemeStore.js';

const App = () => {
  const { authUser, isLoading } = useAuthUser();
  const { theme } = useThemeStore();

  if (isLoading) return <PageLoader />;

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  return (
    
    <div className="min-h-screen bg-transparent relative" data-theme={theme}>
      <div className="absolute inset-0 -z-10 bg-black/20 backdrop-blur-sm" />

      <Routes>
        {/* Public Landing Page */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <LandingPage />
            ) : !isOnboarded ? (
              <Navigate to="/onboarding" />
            ) : (
              <Layout showSidebar>
                <HomePage />
              </Layout>
            )
          }
        />

        {/* Auth */}
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />}
        />
        <Route path="/verify-otp" element={<OTPVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected & Onboarded */}
        <Route
          path="/friends"
          element={isAuthenticated ? (isOnboarded ? <Layout showSidebar><FriendsPage /></Layout> : <Navigate to="/onboarding" />) : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={isAuthenticated ? (isOnboarded ? <Layout showSidebar><NotificationsPage /></Layout> : <Navigate to="/onboarding" />) : <Navigate to="/login" />}
        />
        <Route
          path="/contests"
          element={isAuthenticated ? (isOnboarded ? <Layout showSidebar><ContestPage /></Layout> : <Navigate to="/onboarding" />) : <Navigate to="/login" />}
        />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/my-communities" element={<MyCommunitiesPage />} />
        <Route path="/communities/:id" element={<CommunityDetailPage />} />
        <Route
          path="/news"
          element={isAuthenticated ? (isOnboarded ? <Layout showSidebar><NewsPage /></Layout> : <Navigate to="/onboarding" />) : <Navigate to="/login" />}
        />
        <Route
          path="/call/:id"
          element={isAuthenticated ? (isOnboarded ? <CallPage /> : <Navigate to="/onboarding" />) : <Navigate to="/login" />}
        />
        <Route
          path="/chat/:id"
          element={isAuthenticated ? (isOnboarded ? <Layout showSidebar={false}><ChatPage /></Layout> : <Navigate to="/onboarding" />) : <Navigate to="/login" />}
        />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (!isOnboarded ? <OnboardingPage /> : <Navigate to="/" />) : <Navigate to="/login" />
          }
        />

        {/* Profile */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/edit-profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>

      <Toaster />
      <ChatbotButton />

    </div>
  );
};

export default App;
