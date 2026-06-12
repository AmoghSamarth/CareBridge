# CONTEXT — CareBridge Project

I'm building CareBridge — an AI-powered grooming 
companion and beauty salon marketplace for Tier-2 
Indian cities, starting with Nagpur. Built for the 
SuperXgen AI Startup Buildathon 2026 
(deadline June 22, 2026).

## Repo
https://github.com/AmoghSamarth/CareBridge
Branch: main

## Structure (monorepo)
landing/  → deployed at https://care-bridge-coral.vercel.app
client/   → deployed at https://care-bridge-hp9u.vercel.app
server/   → not deployed yet (Express + Gemini API, optional for now)

## Tech stack
Frontend: React + Vite + Tailwind CSS
Animation: Framer Motion
Design system: "Playful Brutalism"
  Page bg: #FAE8D8 (warm peach)
  Cards: #FFFFFF, border 2.5px solid #1A1A1A, 
    border-radius 16px, shadow 5px 5px 0 #1A1A1A
  Yellow: #F5C842 | Pink: #F03E7A | 
  Teal: #2EC4B6 | Lavender: #9B8FE8 | Dark: #1A1A1A
  Fonts: Plus Jakarta Sans (headings, 800 weight), 
    Inter (body)
  Buttons: 2.5px border, shadow 4px 4px 0 #1A1A1A, 
    hover translate(-2px,-2px) + bigger shadow
Database: Firebase Firestore
Auth: Firebase Auth (Google) — currently has a 
  cross-domain redirect bug, being removed for now
AI: Gemini API for Wingman + NLP search (server side)

---

# TASK — REMOVE LOGIN, SIMPLIFY FLOW

We've been stuck on a Firebase cross-domain auth bug 
for too long (login on landing redirects to client, 
client bounces back to landing). REMOVE this entirely 
for the hackathon demo. Replace with a simple role 
selection that leads straight into the app.

## New flow

1. landing/ — Hero has two buttons:
   "MEET YOUR WINGMAN" and "BROWSE PROFESSIONALS"
   Both buttons go to a new lightweight page: /start

2. /start page (replaces /auth entirely):
   Delete landing/src/pages/AuthPage.jsx and all 
   Firebase auth logic in landing/.

   New page: landing/src/pages/StartPage.jsx
   
   Content:
     Title: "Who are you?"
     Subtitle: "Choose your role to get started 
       with CareBridge"
     
     Two large selectable cards (same visual style 
     as the old role cards):
       Card 1 — "I need grooming"
         emoji: ✂️
         desc: "Book professionals, use Wingman AI, 
           get groomed at home"
         on select: highlight card (yellow bg #F5C842)
       Card 2 — "I am a professional"
         emoji: 💼
         desc: "List your services, manage bookings, 
           grow your clientele"
         on select: highlight card (teal bg #2EC4B6)
     
     "CONTINUE →" button (disabled until a card 
     is selected, pink #F03E7A bg, white text)
     
     On click Continue:
       Store the selected role in localStorage:
         localStorage.setItem('carebridge_role', role)
       
       If role === 'customer':
         redirect to client app root:
         window.location.href = 
           import.meta.env.VITE_CLIENT_URL || 
           'https://care-bridge-hp9u.vercel.app'
       
       If role === 'professional':
         redirect to client app pro-dashboard:
         window.location.href = 
           (import.meta.env.VITE_CLIENT_URL || 
           'https://care-bridge-hp9u.vercel.app') 
           + '/pro-dashboard'

3. client/ — Remove all Firebase Auth gating.
   
   In client/src/context/AuthContext.jsx:
     Remove all Firebase auth listeners 
       (onAuthStateChanged, signInWithCredential, 
       tryAuthHandoff, etc — delete authHandoff.js too)
     
     Instead, create a simple mock user from 
     localStorage on mount:
     
       const role = localStorage.getItem('carebridge_role') 
         || 'customer';
       const user = {
         uid: 'demo-user-' + (role === 'professional' 
           ? 'pro' : 'customer'),
         displayName: role === 'professional' 
           ? 'Priya (Professional)' : 'Arjun',
         email: 'demo@carebridge.app',
         photoURL: null,
       };
     
     onboarding_complete should read from localStorage:
       localStorage.getItem(
         `carebridge_onboarding_${user.uid}`) === 'true'
     
     markOnboardingComplete() sets that localStorage 
     key to 'true'
     
     This means: if user visits client app directly 
     WITHOUT going through /start, default role 
     is 'customer' and it still works — no broken 
     redirect loops ever again.

   In client/src/App.jsx:
     Remove the "if (!user) redirect to landing" 
     block entirely. There is ALWAYS a user now 
     (mock user from localStorage). App goes 
     straight to Wingman onboarding or home screen.
     
     Keep the /pro-dashboard route check.

   Firestore writes (bookings, events, ratings) 
   should still work — just key everything off 
   `user.uid` from the mock user (e.g. 
   "demo-user-customer"). This is fine for a 
   hackathon demo — all interactions persist in 
   Firestore under this fixed demo user ID.

4. Delete unused files:
   landing/src/pages/AuthPage.jsx
   landing/src/lib/urls.js (or strip to just 
     getClientUrl if still used elsewhere)
   client/src/lib/authHandoff.js
   Remove all Firebase Auth imports/usage from 
     landing/src/lib/firebase.js — landing no 
     longer needs Firebase Auth at all. 
     (Firestore can stay if used for waitlist.)

5. Update landing/src/components/Navbar.jsx:
   Replace "LOGIN" button with a button labeled 
   "GET STARTED" that navigates to /start
   Same brutalist yellow button style.

---

# IMPROVEMENT 1 — FAVICON = LOGO (still needed)

Create a reusable Logo component used in BOTH 
navbar and favicon:

landing/src/components/Logo.jsx and 
client/src/components/Logo.jsx:

  Rounded square (border-radius 10px), 
  background #F5C842, border 2px solid #1A1A1A,
  with a bold "W" in Plus Jakarta Sans 800 inside, 
  color #1A1A1A.
  
  Props: size="sm" (28px) | size="lg" (48px)

Use <Logo size="sm" /> next to "CareBridge" text 
in both navbars.

Favicon — add to BOTH landing/index.html and 
client/index.html:

<link rel="icon" type="image/svg+xml" 
  href="data:image/svg+xml,
  <svg xmlns='http://www.w3.org/2000/svg' 
    viewBox='0 0 40 40'>
    <rect width='40' height='40' rx='10' 
      fill='%23F5C842' stroke='%231A1A1A' 
      stroke-width='2'/>
    <text x='50%25' y='58%25' 
      dominant-baseline='middle' 
      text-anchor='middle'
      font-family='sans-serif' 
      font-weight='800'
      font-size='20'
      fill='%231A1A1A'>W</text>
  </svg>"/>

Update <title> tags:
  landing: "CareBridge — AI Grooming Companion"
  client: "CareBridge — Wingman"

---

# IMPROVEMENT 2 — FUNCTIONAL LIGHT/DARK TOGGLE

If client/src/context/ThemeContext.jsx and 
landing/src/context/ThemeContext.jsx don't already 
work correctly, implement this exact pattern in BOTH:

import { createContext, useContext, 
  useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => 
    localStorage.getItem("cb-theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme", theme);
    localStorage.setItem("cb-theme", theme);
  }, [theme]);

  const toggle = () => 
    setTheme(t => t === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

Add CSS variables in index.css for both apps using 
[data-theme="light"] and [data-theme="dark"] 
selectors, covering bg, card bg, text, borders. 
Keep the 5 accent colors (yellow/pink/teal/lavender/
dark) fixed across both themes — only backgrounds 
and text colors change.

Wire up the sun/moon toggle button in both navbars 
to call toggle() from useTheme().

---

# IMPROVEMENT 3 — REDUCE COLOR NOISE

Apply "one accent color per section" rule across 
the whole landing page:

- Hero: yellow primary CTA + teal secondary CTA only
- Features: each card keeps ONE tinted bg + 
  ONE saturated icon box — borders are plain 
  #1A1A1A, not colored
- Wingman demo (dark section): only yellow + pink 
  stat cards; convert other 2 stat cards to plain 
  white/dark with no color fill
- Social proof: white cards only, pink quote mark 
  + pink stars as the only color accents
- For professionals (pink section): feature rows 
  on white bg with yellow checkmark circles only
- Pricing: Starter = plain white, Pro = yellow, 
  Artist = teal — no extra borders/colors
- FAQ: yellow left border on open item only
- Waitlist: lavender section, white input, 
  yellow button

---

# IMPROVEMENT 4 — REMOVE THESE ELEMENTS

In landing/src/components/Hero.jsx delete:
  1. The "✦ AI GROOMING COMPANION" badge/pill 
     above the headline
  2. The "Trusted by 500+ Nagpur residents" row 
     with avatar circles

---

# IMPROVEMENT 5 — SALON-THEMED BACKGROUND ELEMENTS

Replace the current random floating geometric 
shapes (circles, triangles, quarter-circles) in 
landing/src/components/FloatingShapes.jsx with 
SALON/GROOMING-THEMED SVG icons floating in the 
peach background, outside the white content card.

Use simple line-art SVG icons (24-60px), each in 
a colored rounded-square badge (matching the 
existing shape style: border 2.5-3px solid #1A1A1A, 
border-radius 14px, one of the 5 accent colors as 
fill), gently floating/rotating with the existing 
float-rotate animation.

Icons to use (inline SVG paths, simple line style):
  - Scissors ✂️ (haircut)
  - Comb 
  - Hair dryer
  - Nail polish bottle
  - Sparkle/star (for "AI magic")
  - Calendar/clock (for booking/reminders)
  - Razor or beard trimmer
  - Lipstick or makeup brush
  - Spray bottle (for facial/spa)

Distribute 6-8 of these icons around the hero, 
features, and pricing sections at the same 
positions/sizes the old shapes occupied 
(corners and edges, position: fixed/absolute, 
z-index: 0, never overlapping text).

Each badge: 50-70px square, rotate 10-20deg, 
one accent color background (#F5C842, #F03E7A, 
#2EC4B6, or #9B8FE8), border 2.5px solid #1A1A1A, 
icon drawn in #1A1A1A stroke, border-radius 14px.

Keep the existing float-rotate keyframes and 
stagger animation-delays (0s to 2s) for each icon.

---

# FINAL CHECKLIST

After all changes:
1. /start page works — selecting a role and 
   clicking Continue redirects correctly to 
   client (customer) or client/pro-dashboard 
   (professional)
2. Client app loads directly with a mock user — 
   no redirect loops, no Firebase Auth errors
3. Wingman onboarding triggers for new mock users 
   (localStorage-based onboarding flag)
4. Favicon = navbar logo on both apps
5. Theme toggle switches light/dark across 
   entire page on both apps
6. Landing page sections each use ONE accent 
   color, not 4-5 competing colors
7. Hero badge and trust row removed
8. Floating shapes replaced with salon-themed 
   icons (scissors, comb, hairdryer, etc.) in 
   colored badges
9. No leftover references to AuthPage, 
   authHandoff, or Firebase Auth in landing/ 
   or client/
10. Run npm install in landing/ and client/, 
    confirm no broken imports

Show me every file changed and a final file tree 
for landing/ and client/.