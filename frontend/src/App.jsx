import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import axios from 'axios';

const HEALTH_URL = 'http://localhost:8000/health';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [apiStatus, setApiStatus] = useState('checking'); // 'online', 'offline', 'checking'

  // Poll backend health status
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get(HEALTH_URL);
        if (response.data.status === 'healthy') {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (err) {
        setApiStatus('offline');
      }
    };

    // Run check immediately
    checkHealth();

    // Setup periodic polling
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Visual background graphics */}
      <div className="radial-bg" />
      <div className="grid-bg" />

      {/* Main header navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        apiStatus={apiStatus} 
      />

      {/* Route-based page display */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activePage === 'landing' ? (
          <LandingPage setActivePage={setActivePage} />
        ) : (
          <DashboardPage apiStatus={apiStatus} setApiStatus={setApiStatus} />
        )}
      </main>
    </div>
  );
}
