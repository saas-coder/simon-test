import React from 'react';
import { ThemeProvider } from 'next-themes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WelcomeGuide from './components/WelcomeGuide';
import Templates from './pages/Templates';
import Inspirations from './pages/Inspirations';
import Brands from './pages/Brands';
import BrandAds from './pages/BrandAds';
import Knowledge from './pages/Knowledge';
import KnowledgeBase from './pages/KnowledgeBase';
import SavedTemplates from './pages/SavedTemplates';
import Guides from './pages/Guides';
import Help from './pages/Help';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class">
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <div className="flex h-screen overflow-hidden bg-[#13141B]">
                    <Sidebar />
                    <div className="flex-1 flex flex-col p-6">
                      <Header />
                      <div className="flex-1 overflow-hidden mt-6">
                        <div className="page-bg h-full overflow-y-auto">
                          <Routes>
                            <Route path="/" element={<Templates />} />
                            <Route path="/inspirations" element={<Inspirations />} />
                            <Route path="/brands" element={<Brands />} />
                            <Route path="/brands/:brandId/ads" element={<BrandAds />} />
                            <Route path="/knowledge" element={<Knowledge />} />
                            <Route path="/knowledge-base" element={<KnowledgeBase />} />
                            <Route path="/saved" element={<SavedTemplates />} />
                            <Route path="/guides" element={<Guides />} />
                            <Route path="/help" element={<Help />} />
                            <Route path="/settings" element={<Settings />} />
                          </Routes>
                        </div>
                      </div>
                    </div>
                    <WelcomeGuide />
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}