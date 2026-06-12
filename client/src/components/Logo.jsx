import React from 'react';

export default function Logo({ size = "sm" }) {
  const sizeMap = { sm: 28, lg: 48 };
  const pxSize = sizeMap[size] || sizeMap.sm;

  return (
    <svg
      viewBox="0 0 40 40"
      width={pxSize}
      height={pxSize}
      style={{ display: 'block' }}
    >
      <rect
        width="40"
        height="40"
        rx="10"
        fill="#F5C842"
        stroke="#1A1A1A"
        strokeWidth="2"
      />
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Plus Jakarta Sans"
        fontWeight="800"
        fontSize="20"
        fill="#1A1A1A"
      >
        W
      </text>
    </svg>
  );
}
