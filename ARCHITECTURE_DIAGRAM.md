# CareBridge Auth Redirect Architecture

## 🔄 Complete Redirect Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

1. User visits landing page
   ↓
   https://care-bridge-coral.vercel.app/
   
2. User clicks "Sign In" button
   ↓
   Firebase Auth popup opens
   
3. User completes authentication
   ↓
   Firebase returns user object
   
4. Landing page calls redirectToClientAfterAuth(user)
   ↓
   Extracts ID token: user.getIdToken()
   
5. Constructs redirect URL with token
   ↓
   https://care-bridge-hp9u.vercel.app/?auth=<idToken>
   
6. Browser redirects to client app
   ↓
   
7. Client app loads and calls tryAuthHandoff()
   ↓
   Reads ?auth= query parameter
   Cleans URL (removes query param)
   
8. Client calls server endpoint
   ↓
   POST /api/auth/handoff with { idToken }
   
9. Server validates token and creates custom token
   ↓
   Verifies idToken with Firebase Admin SDK
   Creates custom token for that user
   
10. Server returns custom token
    ↓
    Response: { customToken }
    
11. Client signs in with custom token
    ↓
    signInWithCustomToken(auth, customToken)
    
12. Firebase authenticates user on client
    ↓
    User object is now available in client app
    
13. User sees onboarding or home page
    ↓
    ✅ SUCCESS - User logged in on both domains
```

---

## 📊 System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     INTERNET / PUBLIC                         │
│                    (Vercel Deployment)                        │
└──────────────────────────────────────────────────────────────┘
        ↑                              ↑                    ↑
        │                              │                    │
        │                              │                    │
        │ HTTPS                        │ HTTPS              │ HTTPS
        │                              │                    │
        │                              │                    │
┌───────▼──────────┐         ┌────────▼─────────┐   ┌──────▼─────────┐
│  LANDING PAGE    │         │  CLIENT APP      │   │  SERVER/API    │
│  (Coral Domain)  │         │  (HP9U Domain)   │   │  (API Domain)  │
└─────────────────┘         └──────────────────┘   └────────────────┘
  │                           │                          │
  │ 1. Renders               │ 3. Redirected            │ 4. Validates
  │    Auth form             │    with ?auth=            │    token
  │                           │                          │
  │ 2. Gets ID token         │ 5. Makes POST call   →   │ 5. Creates
  │    from Firebase         │    /api/auth/handoff      │    custom token
  │                           │                      ←   │
  │                           │ 6. Gets custom token     │
  │                           │                          │
  │                           │ 7. Signs in with         │
  │                           │    custom token          │
  │                           │                          │
  │                           │ 8. User is logged in ✅  │
  └───────────────────────────┴──────────────────────────┘

           FIREBASE
          (Cloud Auth)
         ┌──────────────┐
         │ Firestore DB │
         │ Users        │
         │ Bookings     │
         │ Professionals│
         └──────────────┘
         ↑          ↑
         │          │
    Both apps verify and use
    Firebase authentication
```

---

## 🔐 Security Flow

```
STEP 1: Landing Page → Get ID Token
┌─────────────────────────────────────────┐
│ const idToken = await user.getIdToken() │
│ - JWT signed by Firebase                 │
│ - Contains user UID and claims           │
│ - Expires in 1 hour                      │
└─────────────────────────────────────────┘

STEP 2: Redirect with ID Token
┌──────────────────────────────────────────────────────────┐
│ URL: https://client.app/?auth=<idToken>                  │
│ - Token is in URL (HTTPS only, secure transmission)      │
│ - URL query param is cleaned from history                │
│ - Token expires quickly                                  │
└──────────────────────────────────────────────────────────┘

STEP 3: Client → Server Token Exchange
┌────────────────────────────────────────┐
│ POST /api/auth/handoff                  │
│ Body: { idToken: "..." }                │
│ - HTTPS secure transmission             │
│ - Server validates immediately         │
│ - Doesn't rely on URL parameter         │
└────────────────────────────────────────┘

STEP 4: Server Validation
┌────────────────────────────────────────────────────┐
│ admin.auth().verifyIdToken(idToken)                │
│ - Verifies JWT signature                           │
│ - Checks token hasn't expired                      │
│ - Gets user UID                                    │
│ - Confirms user exists in Firebase                 │
└────────────────────────────────────────────────────┘

STEP 5: Server → Create Custom Token
┌──────────────────────────────────────────┐
│ customToken = await admin.auth()         │
│   .createCustomToken(uid)                │
│ - Short-lived (1 hour)                   │
│ - Signed by Firebase Admin SDK           │
│ - Only valid for this specific user      │
└──────────────────────────────────────────┘

STEP 6: Client Signs In
┌────────────────────────────────────────┐
│ signInWithCustomToken(auth, customToken)│
│ - Firebase verifies custom token        │
│ - Creates session for user              │
│ - User can now use client app           │
└────────────────────────────────────────┘

✅ USER AUTHENTICATED ON CLIENT APP
```

---

## 📁 File Dependencies

```
Landing Page
├── src/lib/urls.js
│   └── redirectToClientAfterAuth(user)
│       └── window.location.href = client_url?auth=token
│
├── src/lib/firebase.js
│   └── Firebase Auth SDK
│
└── src/pages/AuthPage.jsx
    └── handleGoogleSignIn() / handleEmailSignIn()
        └── calls redirectToClientAfterAuth()

Client App
├── src/lib/authHandoff.js
│   └── tryAuthHandoff(auth)
│       └── reads ?auth= param
│       └── POST to server /api/auth/handoff
│
├── src/context/AuthContext.jsx
│   └── useEffect calls tryAuthHandoff()
│   └── onAuthStateChanged() signs user in
│
└── src/lib/firebase.js
    └── Firebase Auth SDK

Server
├── routes/auth.js
│   └── POST /api/auth/handoff
│       └── verifyIdToken(idToken)
│       └── createCustomToken(uid)
│
├── lib/firebase-admin.js
│   └── Firebase Admin SDK
│
└── server.js
    └── Express app with CORS
```

---

## 🌐 Domain Configuration

```
DEVELOPMENT (Local)
┌─────────────────────────────────────────┐
│ Landing: http://localhost:5174          │
│ Client:  http://localhost:5173          │
│ Server:  http://localhost:3000          │
└─────────────────────────────────────────┘

PRODUCTION (Vercel)
┌────────────────────────────────────────────────────────┐
│ Landing: https://care-bridge-coral.vercel.app          │
│ Client:  https://care-bridge-hp9u.vercel.app           │
│ Server:  https://carebridge-server.vercel.app          │
│          (or your custom API domain)                    │
└────────────────────────────────────────────────────────┘

CROSS-DOMAIN REDIRECT
Landing Domain          →    Client Domain
care-bridge-coral...   →    care-bridge-hp9u...
        ↓                           ↓
     ?auth=<token>             Receives token
        ↓                           ↓
   Exchange w/ Server          Uses token to sign in
```

---

## ✅ Implementation Status

| Component | Status | Location |
|-----------|--------|----------|
| Landing page redirect logic | ✅ Done | `landing/src/lib/urls.js` |
| Auth handoff endpoint | ✅ Done | `server/routes/auth.js` |
| Client token processing | ✅ Done | `client/src/lib/authHandoff.js` |
| Environment templates | ✅ Created | `.env.local` files |
| Vercel configs | ✅ Created | `vercel.json` files |
| Firebase domain auth | ⏳ Manual | Firebase Console |
| Environment variables | ⏳ Manual | Vercel Projects |

---

## 🚀 Deployment Checklist

- [ ] Firebase: Add authorized domains
- [ ] Landing Vercel: Set env vars + redeploy
- [ ] Client Vercel: Set env vars + redeploy
- [ ] Server Vercel: Set env vars + redeploy
- [ ] Test: Complete login flow
- [ ] Verify: User logged in on client after redirect
