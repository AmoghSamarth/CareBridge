import React from 'react';
import { useTheme } from '../context/ThemeContext';

const positions = [
  { top: '4%',  left: '2%',   size: 52, rot: -15, type: 'scissors' },
  { top: '3%',  left: '88%',  size: 44, rot: 20,  type: 'comb' },
  { top: '18%', left: '4%',   size: 40, rot: 10,  type: 'mirror' },
  { top: '28%', left: '96%',  size: 48, rot: -20, type: 'razor' },
  { top: '35%', left: '1%',   size: 34, rot: 15,  type: 'sparkle' },
  { top: '45%', left: '93%',  size: 42, rot: 8,   type: 'scissors' },
  { top: '52%', left: '3%',   size: 38, rot: -12, type: 'comb' },
  { top: '60%', left: '95%',  size: 46, rot: 25,  type: 'mirror' },
  { top: '68%', left: '2%',   size: 36, rot: -8,  type: 'razor' },
  { top: '75%', left: '92%',  size: 40, rot: 12,  type: 'sparkle' },
  { top: '82%', left: '5%',   size: 44, rot: -18, type: 'scissors' },
  { top: '88%', left: '90%',  size: 34, rot: 5,   type: 'comb' },
];

const Icon = ({ type, color, size }) => {
  const s = { width: size, height: size, display: 'block' };
  if (type === 'scissors') return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
      <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/>
      <line x1="8.12" y1="8.12" x2="12" y2="12"/>
    </svg>
  );
  if (type === 'comb') return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="9" width="20" height="4" rx="1"/>
      <line x1="5" y1="9" x2="5" y2="5"/><line x1="8" y1="9" x2="8" y2="5"/>
      <line x1="11" y1="9" x2="11" y2="5"/><line x1="14" y1="9" x2="14" y2="5"/>
      <line x1="17" y1="9" x2="17" y2="5"/><line x1="20" y1="9" x2="20" y2="5"/>
    </svg>
  );
  if (type === 'mirror') return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="9" r="7"/>
      <line x1="12" y1="16" x2="12" y2="22"/>
      <line x1="9" y1="22" x2="15" y2="22"/>
    </svg>
  );
  if (type === 'razor') return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <rect x="5" y="3" width="14" height="5" rx="1"/>
      <path d="M5 8l2 13h10l2-13"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
    </svg>
  );
  if (type === 'sparkle') return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  );
  return null;
};

export default function PageBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const color = isDark ? 'rgba(245,200,66,0.10)' : 'rgba(26,26,26,0.07)';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {positions.map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', top: pos.top, left: pos.left,
          transform: `rotate(${pos.rot}deg)`,
        }}>
          <Icon type={pos.type} color={color} size={pos.size} />
        </div>
      ))}
    </div>
  );
}