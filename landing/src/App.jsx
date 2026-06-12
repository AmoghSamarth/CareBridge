import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import StartPage from './pages/StartPage.jsx';
import FloatingShapes from './components/FloatingShapes.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="page-wrapper">
          {/* Organic floating shapes live on the peach background, outside the white card */}
          <FloatingShapes />

          <div className="content-card">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/start" element={<StartPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
