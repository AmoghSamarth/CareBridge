import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

const HomeIcon = ({ active, color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? color : 'none'} stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const GridIcon = ({ active, color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" fill={active ? color : 'none'}/><rect x="14" y="3" width="7" height="7" rx="1" fill={active ? color : 'none'}/><rect x="14" y="14" width="7" height="7" rx="1" fill={active ? color : 'none'}/><rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const CalIcon = ({ active, color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const UserIcon = ({ active, color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4" fill={active ? color : 'none'}/>
  </svg>
);
const LogOutIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const SunIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
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
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  const borderColor = isDark ? '#333' : '#1A1A1A';
  const shadowColor = isDark ? '#000' : '#1A1A1A';
  const textColor = isDark ? '#F5F0E8' : '#1A1A1A';
  const mutedColor = isDark ? '#888' : '#6B6B6B';
  const navBg = isDark ? '#161616' : '#FFFFFF';

  const buttonBase = {
    width: '32px', height: '32px', borderRadius: '8px',
    border: `2px solid ${borderColor}`,
    boxShadow: `2px 2px 0 ${shadowColor}`,
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'transform 0.12s, box-shadow 0.12s',
  };

  return (
    <>
      {/* Top header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '68px', background: navBg,
        borderBottom: `2.5px solid ${borderColor}`,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Logo size="sm" />
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '18px', color: textColor }}>
            CareBridge
          </span>
        </div>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName}
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${borderColor}`, objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F5C842', border: `2px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', color: '#1A1A1A' }}>
                  {(user.displayName || 'U')[0]}
                </span>
              </div>
            )}
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '13px', color: textColor }}>
              {(user.displayName || '').split(' ')[0]}
            </span>
            {/* Theme toggle */}
            <button onClick={toggle}
              style={{ ...buttonBase, background: isDark ? '#222' : '#F5C842' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = `3px 3px 0 ${shadowColor}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `2px 2px 0 ${shadowColor}`; }}
            >
              {isDark ? <SunIcon color="#F5C842" /> : <MoonIcon color="#1A1A1A" />}
            </button>
            {/* Sign out */}
            <button onClick={logout}
              style={{ ...buttonBase, background: isDark ? '#222' : '#fff' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = `3px 3px 0 ${shadowColor}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `2px 2px 0 ${shadowColor}`; }}
            >
              <LogOutIcon color={textColor} />
            </button>
          </div>
        )}
      </header>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        height: '68px', background: navBg,
        borderTop: `2.5px solid ${borderColor}`,
        borderRadius: '20px 20px 0 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      }}>
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          const accentColor = tabColors[id];
          const iconColor = isActive ? '#1A1A1A' : (isDark ? '#888' : '#1A1A1A');
          return (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <div style={{
                width: '38px', height: '38px', borderRadius: '12px',
                background: isActive ? accentColor : 'transparent',
                border: isActive ? `2px solid ${borderColor}` : '2px solid transparent',
                boxShadow: isActive ? `2px 2px 0 ${shadowColor}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                <Icon active={isActive} color={iconColor} />
              </div>
              <span style={{
                fontFamily: 'Plus Jakarta Sans', fontWeight: 700,
                fontSize: '9px', textTransform: 'uppercase',
                color: isActive ? textColor : mutedColor,
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