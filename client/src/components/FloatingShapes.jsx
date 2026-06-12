import React from 'react';

const shapeBase = {
  position: 'absolute',
  zIndex: 0,
  pointerEvents: 'none',
};

const sectionShapes = {
  hero: [
    { width: '80px', height: '80px', backgroundColor: '#FFE566', left: '85%', top: '10%', transform: 'rotate(15deg)', animation: 'float-rotate 4s ease-in-out infinite' },
    { width: '70px', height: '35px', backgroundColor: '#FF6B9D', borderRadius: '70px 70px 0 0', left: '5%', top: '75%', animation: 'float-rotate 5s ease-in-out infinite 0.5s' },
    { width: '60px', height: '60px', background: 'transparent', border: '5px solid #4ECDC4', borderRadius: '999px', left: '8%', top: '15%', animation: 'float-rotate 6s ease-in-out infinite 1s' },
    { width: '70px', height: '60px', backgroundColor: '#FF6B6B', clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', left: '90%', top: '80%', animation: 'float-rotate 4.5s ease-in-out infinite 1.5s' },
    { width: '40px', height: '40px', backgroundColor: '#FFE566', borderRadius: '999px', left: '78%', top: '45%', animation: 'float-rotate 3.5s ease-in-out infinite 0.8s' },
  ],
  features: [
    { width: '80px', height: '80px', backgroundColor: '#FFE566', left: '2%', top: '5%', transform: 'rotate(15deg)', animation: 'float-rotate 4s ease-in-out infinite' },
    { width: '60px', height: '60px', background: 'transparent', border: '5px solid #4ECDC4', borderRadius: '999px', right: '2%', bottom: '5%', animation: 'float-rotate 6s ease-in-out infinite 1s' },
  ],
  pricing: [
    { width: '70px', height: '35px', backgroundColor: '#FF6B9D', borderRadius: '70px 70px 0 0', right: '5%', top: '5%', animation: 'float-rotate 5s ease-in-out infinite 0.5s' },
    { width: '70px', height: '60px', backgroundColor: '#FF6B6B', clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', left: '5%', bottom: '5%', animation: 'float-rotate 4.5s ease-in-out infinite 1.5s' },
  ],
};

export default function FloatingShapes({ section }) {
  const shapes = sectionShapes[section];

  if (!shapes) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape, index) => (
        <div
          key={`${section}-shape-${index}`}
          className="absolute border-3 border-dark hidden md:block"
          style={{
            ...shapeBase,
            ...shape,
          }}
        />
      ))}
    </div>
  );
}
