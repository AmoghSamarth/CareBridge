import React from 'react';
import { useAuth } from '../context/AuthContext';

// Inline SVG icons — no lucide-react needed
const HomeIcon = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#1A1A1A' : 'none'} stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const GridIcon = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" fill={active ? '#1A1A1A' : 'none'}/><rect x="14" y="3" width="7" height="7" rx="1" fill={active ? '#1A1A1A' : 'none'}/><rect x="14" y="14" width="7" height="7" rx="1" fill={active ? '#1A1A1A' : 'none'}/><rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const CalIcon = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const UserIcon = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4" fill={active ? '#1A1A1A' : 'none'}/>
  </svg>
);
const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const tabColors = {
  wingman: '#F5C842',
  browse: '#2EC4B6',
  bookings: '#F03E7A',
  profile: '#9B8FE8',
};

const navItems = [
  { id: 'wingman',  label: 'Wingman',  Icon: HomeIcon },
  { id: 'browse',   label: 'Browse',   Icon: GridIcon },
  { id: 'bookings', label: 'Bookings', Icon: CalIcon },
  { id: 'profile',  label: 'Profile',  Icon: UserIcon },
];

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Top header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '68px',
        background: '#FFFFFF',
        borderBottom: '2.5px solid #1A1A1A',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', background: '#9B8FE8',
            border: '2px solid #1A1A1A', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '14px', color: '#fff' }}>C</span>
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '18px', color: '#1A1A1A', letterSpacing: '-0.02em' }}>
            CareBridge
          </span>
        </div>

        {/* User row */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName}
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #1A1A1A', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: '#F5C842', border: '2px solid #1A1A1A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', color: '#1A1A1A' }}>
                  {(user.displayName || 'U')[0]}
                </span>
              </div>
            )}
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '13px', color: '#1A1A1A' }}
              className="hidden sm:inline">
              {(user.displayName || '').split(' ')[0]}
            </span>
            <button onClick={logout} title="Sign out"
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: '2px solid #1A1A1A', background: '#FFFFFF',
                boxShadow: '2px 2px 0 #1A1A1A', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#1A1A1A', transition: 'transform 0.12s, box-shadow 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0 #1A1A1A'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '2px 2px 0 #1A1A1A'; }}
            >
              <LogOutIcon />
            </button>
          </div>
        )}
      </header>

      {/* Bottom navigation */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        height: '68px',
        background: '#FFFFFF',
        borderTop: '2.5px solid #1A1A1A',
        borderRadius: '20px 20px 0 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      }}>
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          const color = tabColors[id];
          return (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{
                flex: 1, height: '100%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '4px', background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <div style={{
                width: '38px', height: '38px',
                borderRadius: '12px',
                background: isActive ? color : 'transparent',
                border: isActive ? '2px solid #1A1A1A' : '2px solid transparent',
                boxShadow: isActive ? '2px 2px 0 #1A1A1A' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                <Icon active={isActive} />
              </div>
              <span style={{
                fontFamily: 'Plus Jakarta Sans', fontWeight: 700,
                fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em',
                color: isActive ? '#1A1A1A' : '#6B6B6B',
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
