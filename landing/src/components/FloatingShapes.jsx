import React from 'react';

/**
 * FloatingShapes — organic decorative shapes that float on the peach
 * .page-wrapper background OUTSIDE the white .content-card.
 * They are position: fixed so they stay visible as the user scrolls.
 */
export default function FloatingShapes() {
  return (
    <div className="shapes-layer" aria-hidden="true">

      {/* Shape 1 — Top left: Teal half circle */}
      <div
        className="shape-float"
        style={{
          position: 'fixed',
          top: '8%',
          left: '-20px',
          width: '100px',
          height: '50px',
          background: '#2EC4B6',
          border: '3px solid #1A1A1A',
          borderRadius: '0 0 50px 50px',
          animationDelay: '0s',
        }}
      />

      {/* Shape 2 — Top right: Hot pink quarter circle */}
      <div
        className="shape-float-delay1"
        style={{
          position: 'fixed',
          top: '5%',
          right: '-15px',
          width: '90px',
          height: '90px',
          background: '#F03E7A',
          border: '3px solid #1A1A1A',
          borderRadius: '90px 0 0 0',
          animationDelay: '0.5s',
        }}
      />

      {/* Shape 3 — Middle left: Lavender circle */}
      <div
        className="shape-float-slow"
        style={{
          position: 'fixed',
          top: '40%',
          left: '-20px',
          width: '80px',
          height: '80px',
          background: '#9B8FE8',
          border: '3px solid #1A1A1A',
          borderRadius: '50%',
          animationDelay: '1s',
        }}
      />

      {/* Shape 4 — Bottom right: Yellow quarter circle */}
      <div
        className="shape-float-delay2"
        style={{
          position: 'fixed',
          bottom: '15%',
          right: '-25px',
          width: '100px',
          height: '100px',
          background: '#F5C842',
          border: '3px solid #1A1A1A',
          borderRadius: '0 0 0 100px',
          animationDelay: '1s',
        }}
      />

      {/* Shape 5 — Bottom left: Coral half circle */}
      <div
        className="shape-float-delay3"
        style={{
          position: 'fixed',
          bottom: '10%',
          left: '-15px',
          width: '70px',
          height: '35px',
          background: '#FF6B35',
          border: '3px solid #1A1A1A',
          borderRadius: '35px 35px 0 0',
          animationDelay: '0.8s',
        }}
      />

      {/* Shape 6 — Top center-right: Small yellow triangle */}
      <div
        className="shape-float"
        style={{
          position: 'fixed',
          top: '12%',
          right: '8%',
          width: 0,
          height: 0,
          borderTop: '20px solid transparent',
          borderBottom: '20px solid transparent',
          borderLeft: '34px solid #F5C842',
          filter: 'drop-shadow(2px 2px 0 #1A1A1A)',
          animationDelay: '0.3s',
        }}
      />

      {/* Shape 7 — Middle right: Pink rounded square rotated */}
      <div
        className="shape-rotate"
        style={{
          position: 'fixed',
          top: '55%',
          right: '-15px',
          width: '60px',
          height: '60px',
          background: '#F03E7A',
          border: '3px solid #1A1A1A',
          borderRadius: '12px',
          transform: 'rotate(15deg)',
          animationDelay: '1.2s',
        }}
      />

      {/* Shape 8 — Extra: Teal small circle, left middle-bottom */}
      <div
        className="shape-float-delay1"
        style={{
          position: 'fixed',
          bottom: '30%',
          left: '2%',
          width: '36px',
          height: '36px',
          background: '#2EC4B6',
          border: '3px solid #1A1A1A',
          borderRadius: '50%',
          animationDelay: '2s',
        }}
      />

    </div>
  );
}
