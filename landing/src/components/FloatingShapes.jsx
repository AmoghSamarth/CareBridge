import React from 'react';

const iconProps = {
  width: 34,
  height: 34,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#1A1A1A',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const icons = {
  scissors: (
    <svg {...iconProps}>
      <circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/>
      <path d="M8.2 7.8 20 19M8.2 16.2 20 5"/>
    </svg>
  ),
  comb: (
    <svg {...iconProps}>
      <path d="M4 7h16v4H4z"/>
      <path d="M6 11v7M9 11v6M12 11v7M15 11v6M18 11v7"/>
    </svg>
  ),
  dryer: (
    <svg {...iconProps}>
      <path d="M4 8h10l5-2v8l-5-2H4z"/>
      <path d="M10 12v7H7l-1-7M19 9h2M19 12h2"/>
    </svg>
  ),
  polish: (
    <svg {...iconProps}>
      <path d="M10 3h4v4h-4zM8 8h8l1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/>
      <path d="M10 13h4"/>
    </svg>
  ),
  sparkle: (
    <svg {...iconProps}>
      <path d="m12 3-1.8 5.2a2 2 0 0 1-1.2 1.2L4 11l5 1.6a2 2 0 0 1 1.2 1.2L12 21l1.8-7.2a2 2 0 0 1 1.2-1.2L20 11l-5-1.6a2 2 0 0 1-1.2-1.2Z"/>
    </svg>
  ),
  calendar: (
    <svg {...iconProps}>
      <rect x="4" y="5" width="16" height="15" rx="2"/>
      <path d="M8 3v4M16 3v4M4 10h16M8 15h4"/>
    </svg>
  ),
  trimmer: (
    <svg {...iconProps}>
      <path d="M8 3h8v4H8zM9 7h6l2 13H7z"/>
      <path d="M10 11h4M11 15h2"/>
    </svg>
  ),
  lipstick: (
    <svg {...iconProps}>
      <path d="M10 8V5l4-2v5M9 8h6v11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/>
      <path d="M9 13h6"/>
    </svg>
  ),
  spray: (
    <svg {...iconProps}>
      <path d="M9 8h7v3H9zM11 11h4v10h-4zM11 5h3v3h-3z"/>
      <path d="M16 7h4M19 4l2-1M19 10l2 1M6 14h5"/>
    </svg>
  ),
};

const badges = [
  { icon: 'scissors', className: 'shape-float', top: '8%', left: '-16px', size: 64, bg: '#2EC4B6', rotate: '-12deg', delay: '0s' },
  { icon: 'dryer', className: 'shape-float-delay1', top: '6%', right: '-12px', size: 68, bg: '#F03E7A', rotate: '14deg', delay: '0.5s' },
  { icon: 'comb', className: 'shape-float-slow', top: '34%', left: '-18px', size: 58, bg: '#9B8FE8', rotate: '10deg', delay: '1s' },
  { icon: 'calendar', className: 'shape-float-delay2', bottom: '16%', right: '-18px', size: 66, bg: '#F5C842', rotate: '-16deg', delay: '1s' },
  { icon: 'polish', className: 'shape-float-delay3', bottom: '10%', left: '-10px', size: 56, bg: '#F03E7A', rotate: '12deg', delay: '0.8s' },
  { icon: 'sparkle', className: 'shape-rotate', top: '14%', right: '8%', size: 52, bg: '#F5C842', rotate: '18deg', delay: '0.3s' },
  { icon: 'trimmer', className: 'shape-float-delay1', top: '55%', right: '-12px', size: 58, bg: '#2EC4B6', rotate: '-10deg', delay: '1.2s' },
  { icon: 'lipstick', className: 'shape-float', bottom: '30%', left: '2%', size: 50, bg: '#9B8FE8', rotate: '15deg', delay: '2s' },
  { icon: 'spray', className: 'shape-float-slow', top: '72%', right: '7%', size: 54, bg: '#F5C842', rotate: '-14deg', delay: '1.6s' },
];

export default function FloatingShapes() {
  return (
    <div className="shapes-layer" aria-hidden="true">
      {badges.map((badge, index) => (
        <div
          key={`${badge.icon}-${index}`}
          className={badge.className}
          style={{
            position: 'fixed',
            top: badge.top,
            right: badge.right,
            bottom: badge.bottom,
            left: badge.left,
            width: badge.size,
            height: badge.size,
            background: badge.bg,
            border: '2.5px solid #1A1A1A',
            borderRadius: '14px',
            boxShadow: '3px 3px 0 #1A1A1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `rotate(${badge.rotate})`,
            animationDelay: badge.delay,
          }}
        >
          {icons[badge.icon]}
        </div>
      ))}
    </div>
  );
}
