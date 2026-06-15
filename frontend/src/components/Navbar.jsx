import { Terminal, Activity } from 'lucide-react';

const Github = ({ size = 20, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function Navbar({ activePage, setActivePage, apiStatus }) {
  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: '1rem',
      margin: '1rem 2rem 2rem 2rem',
      padding: '0.75rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
    }}>
      {/* Brand logo */}
      <div 
        onClick={() => setActivePage('landing')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
      >
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          padding: '0.5rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 4px 10px rgba(124, 58, 237, 0.3)'
        }}>
          <Terminal size={20} color="white" />
        </div>
        <span style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}>
          CodePilot <span className="text-gradient-purple-cyan" style={{ fontWeight: 800 }}>AI</span>
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <span 
          onClick={() => setActivePage('landing')} 
          style={{
            color: activePage === 'landing' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'color 0.2s',
            position: 'relative'
          }}
        >
          Features
          {activePage === 'landing' && (
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              left: 0,
              width: '100%',
              height: '2px',
              background: 'var(--color-primary)',
              borderRadius: '2px'
            }} />
          )}
        </span>
        <span 
          onClick={() => setActivePage('dashboard')} 
          style={{
            color: activePage === 'dashboard' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'color 0.2s',
            position: 'relative'
          }}
        >
          Playground
          {activePage === 'dashboard' && (
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              left: 0,
              width: '100%',
              height: '2px',
              background: 'var(--color-primary)',
              borderRadius: '2px'
            }} />
          )}
        </span>
      </div>

      {/* CTA / Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* API Status Indicator */}
        <div className="glass-panel" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.8rem',
          borderRadius: '30px',
          fontSize: '0.75rem',
          fontWeight: 500,
          background: 'rgba(255,255,255,0.02)',
          borderColor: 'rgba(255,255,255,0.04)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: apiStatus === 'online' ? '#10b981' : apiStatus === 'checking' ? '#f59e0b' : '#ef4444',
            boxShadow: apiStatus === 'online' ? '0 0 8px #10b981' : apiStatus === 'checking' ? '0 0 8px #f59e0b' : '0 0 8px #ef4444'
          }} />
          <span style={{ color: 'var(--text-secondary)' }}>
            API: {apiStatus === 'online' ? 'ONLINE' : apiStatus === 'checking' ? 'SYNCING...' : 'OFFLINE'}
          </span>
        </div>

        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <Github size={16} />
          <span>GitHub</span>
        </a>
      </div>
    </nav>
  );
}
