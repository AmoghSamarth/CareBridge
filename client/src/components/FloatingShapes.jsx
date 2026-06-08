import React from 'react';

export default function FloatingShapes({ section }) {
  if (section === 'hero') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute border-3 border-dark hidden md:block"
          style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#FFE566',
            left: '85%',
            top: '10%',
            transform: 'rotate(15deg)',
            animation: 'float-rotate 4s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute border-3 border-dark hidden md:block"
          style={{
            width: '70px',
            height: '35px',
            backgroundColor: '#FF6B9D',
            borderRadius: '70px 70px 0 0',
            left: '5%',
            top: '75%',
            animation: 'float-rotate 5s ease-in-out infinite 0.5s',
          }}
        />
        <div 
          className="absolute rounded-full hidden md:block"
          style={{
            width: '60px',
            height: '60px',
            background: 'transparent',
            border: '5px solid #4ECDC4',
            left: '8%',
            top: '15%',
            animation: 'float-rotate 6s ease-in-out infinite 1s',
          }}
        />
        <div 
          className="absolute hidden md:block"
          style={{
            width: 0,
            height: 0,
            borderLeft: '35px solid transparent',
            borderRight: '35px solid transparent',
            borderBottom: '60px solid #FF6B6B',
            left: '90%',
            top: '80%',
            animation: 'float-rotate 4.5s ease-in-out infinite 1.5s',
          }}
        />
        <div 
          className="absolute rounded-full border-3 border-dark hidden md:block"
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#FFE566',
            left: '78%',
            top: '45%',
            animation: 'float-rotate 3.5s ease-in-out infinite 0.8s',
          }}
        />
      </div>
    );
  }

  if (section === 'features') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute border-3 border-dark hidden md:block"
          style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#FFE566',
            left: '2%',
            top: '5%',
            transform: 'rotate(15deg)',
            animation: 'float-rotate 4s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute rounded-full hidden md:block"
          style={{
            width: '60px',
            height: '60px',
            background: 'transparent',
            border: '5px solid #4ECDC4',
            right: '2%',
            bottom: '5%',
            animation: 'float-rotate 6s ease-in-out infinite 1s',
          }}
        />
      </div>
    );
  }

  if (section === 'pricing') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute border-3 border-dark hidden md:block"
          style={{
            width: '70px',
            height: '35px',
            backgroundColor: '#FF6B9D',
            borderRadius: '70px 70px 0 0',
            right: '5%',
            top: '5%',
            animation: 'float-rotate 5s ease-in-out infinite 0.5s',
          }}
        />
        <div 
          className="absolute hidden md:block"
          style={{
            width: 0,
            height: 0,
            borderLeft: '35px solid transparent',
            borderRight: '35px solid transparent',
            borderBottom: '60px solid #FF6B6B',
            left: '5%',
            bottom: '5%',
            animation: 'float-rotate 4.5s ease-in-out infinite 1.5s',
          }}
        />
      </div>
    );
  }

  return null;
}
