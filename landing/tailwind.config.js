/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        peach: "#FAE8D8",
        yellow: "#F5C842",
        pink: "#F03E7A",
        teal: "#2EC4B6",
        lavender: "#9B8FE8",
        coral: "#FF6B35",
        dark: "#1A1A1A",
        white: "#FFFFFF",
        muted: "#6B6B6B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
        xl2: "20px",
        xl3: "24px",
      },
      boxShadow: {
        brutal: "5px 5px 0px #1A1A1A",
        "brutal-sm": "3px 3px 0px #1A1A1A",
        "brutal-lg": "8px 8px 0px #1A1A1A",
        "brutal-xl": "10px 10px 0px #1A1A1A",
        "brutal-yellow": "5px 5px 0px #F5C842",
        "brutal-pink": "5px 5px 0px #F03E7A",
        "brutal-hover": "7px 7px 0px #1A1A1A",
      },
      borderWidth: {
        2.5: "2.5px",
        3: "3px",
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        'float-rotate': 'float-rotate 5s ease-in-out infinite',
        'blink': 'blink 1.2s step-end infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-rotate': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(12deg)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
