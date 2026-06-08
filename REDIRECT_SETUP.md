# CareBridge Auth Redirect Setup Guide

## ✅ What's Already Implemented

The redirect flow from **landing page** → **login** → **client app** is fully coded:

1. **Landing Page** (`src/lib/urls.js`):
   - `redirectToClientAfterAuth(user)` - redirects to client with `?auth=<idToken>`
   - `getClientUrl()` - returns correct client URL based on environment

2. **Client App** (`src/lib/authHandoff.js`):
   - `tryAuthHandoff()` - reads `?auth=` param and calls server handoff endpoint
   - Exchanges ID token for custom token and signs in

3. **Server** (`routes/auth.js`):
   - `/api/auth/handoff` - POST endpoint that verifies ID token and creates custom token

---

## 🚀 Vercel Deployment Setup

### Step 1: Landing Page Environment Variables
Set these in Vercel for **care-bridge-coral.vercel.app**:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=carebridge-3eec0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=carebridge-3eec0
VITE_FIREBASE_STORAGE_BUCKET=carebridge-3eec0.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLIENT_URL=https://care-bridge-hp9u.vercel.app
VITE_API_URL=https://carebridge-server.vercel.app  (or your backend URL)
```

### Step 2: Client App Environment Variables
Set these in Vercel for **care-bridge-hp9u.vercel.app**:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=carebridge-3eec0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=carebridge-3eec0
VITE_FIREBASE_STORAGE_BUCKET=carebridge-3eec0.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_LANDING_URL=https://care-bridge-coral.vercel.app
VITE_API_URL=https://carebridge-server.vercel.app  (or your backend URL)
```

### Step 3: Server Environment Variables
Set these in Vercel for **carebridge-server.vercel.app**:

```
FIREBASE_PROJECT_ID=carebridge-3eec0
FIREBASE_PRIVATE_KEY=your_firebase_private_key_from_service_account
FIREBASE_CLIENT_EMAIL=your_firebase_service_account_email
NODE_ENV=production
CORS_ORIGIN=https://care-bridge-hp9u.vercel.app
```

### Step 4: Firebase Console Configuration

**Add authorized domains:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select carebridge-3eec0 project
3. Go to **Build** → **Authentication** → **Settings**
4. Scroll to **Authorized domains**
5. Add:
   - `localhost` (for local development)
   - `care-bridge-coral.vercel.app` (landing page)
   - `care-bridge-hp9u.vercel.app` (client app)
6. Save

---

## 🔄 How the Redirect Flow Works

```
1. User visits: https://care-bridge-coral.vercel.app
2. User clicks "Sign In"
3. After successful Firebase auth, landing page calls:
   redirectToClientAfterAuth(user)
4. Gets user's ID token: user.getIdToken()
5. Redirects to: https://care-bridge-hp9u.vercel.app?auth=<idToken>
6. Client app loads and calls tryAuthHandoff()
7. Reads ?auth= param from URL
8. Cleans URL (removes query param)
9. POSTs to server: /api/auth/handoff with idToken
10. Server verifies token and returns customToken
11. Client signs in with customToken
12. User is now authenticated in client app
```

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js v18+
- Firebase project credentials

### 1. Create local env files

Copy `.env.example` files and update with your credentials:

```bash
# Landing page
cp landing/.env.example landing/.env.local

# Client app
cp client/.env.example client/.env.local

# Server
cp server/.env.example server/.env.local
```

### 2. Update local .env files

**landing/.env.local:**
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=carebridge-3eec0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=carebridge-3eec0
VITE_FIREBASE_STORAGE_BUCKET=carebridge-3eec0.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000
```

**client/.env.local:**
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=carebridge-3eec0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=carebridge-3eec0
VITE_FIREBASE_STORAGE_BUCKET=carebridge-3eec0.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_LANDING_URL=http://localhost:5174
VITE_API_URL=http://localhost:3000
```

**server/.env.local:**
```
FIREBASE_PROJECT_ID=carebridge-3eec0
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_service_account_email
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### 3. Run three terminals

**Terminal 1 - Server:**
```bash
cd server
npm install
npm run dev
```
Runs at `http://localhost:3000`

**Terminal 2 - Landing Page:**
```bash
cd landing
npm install
npm run dev
```
Runs at `http://localhost:5174`

**Terminal 3 - Client App:**
```bash
cd client
npm install
npm run dev
```
Runs at `http://localhost:5173`

### 4. Test the flow locally

1. Visit `http://localhost:5174`
2. Click "Sign In"
3. Complete authentication
4. Should redirect to `http://localhost:5173?auth=<token>`
5. Client app should process token and authenticate
6. User should be logged in

---

## 🔍 Troubleshooting

### "Firebase auth not configured for this domain"
- Add the domain to Firebase Console → Authentication → Authorized Domains

### Redirect stuck on landing page
- Check browser console for errors
- Verify `VITE_CLIENT_URL` is set correctly in landing page env vars
- Verify Firebase is initialized

### Redirect happens but user not logged in on client
- Check browser console for errors in client app
- Verify `VITE_API_URL` is set correctly in client app env vars
- Check server logs: `POST /api/auth/handoff` being called?
- Verify Firebase Admin SDK is initialized on server

### CORS errors
- Check server `CORS_ORIGIN` env var matches client URL
- In production, ensure server CORS allows client domain

---

## 📋 Checklist for Production

- [ ] Firebase authorized domains include both Vercel domains
- [ ] Landing page `VITE_CLIENT_URL` = `https://care-bridge-hp9u.vercel.app`
- [ ] Client app `VITE_API_URL` = your backend server URL
- [ ] Server has Firebase Admin credentials
- [ ] Server `CORS_ORIGIN` includes client app URL
- [ ] All Firebase env vars are set on all three Vercel projects
- [ ] Test: Login on landing → redirect → authenticated on client

---

## 📚 File Structure

```
.
├── landing/
│   ├── src/
│   │   ├── lib/urls.js          # redirectToClientAfterAuth()
│   │   └── pages/AuthPage.jsx   # Login page
│   ├── .env.local               # Local dev config
│   └── vercel.json              # Vercel deployment config
├── client/
│   ├── src/
│   │   ├── lib/authHandoff.js   # tryAuthHandoff()
│   │   ├── context/AuthContext.jsx
│   │   └── App.jsx
│   ├── .env.local               # Local dev config
│   └── vercel.json              # Vercel deployment config
└── server/
    ├── routes/auth.js            # /api/auth/handoff endpoint
    ├── .env.local                # Local dev config
    └── vercel.json               # Vercel deployment config
```

---

## 🎯 Next Steps

1. **Update Vercel project settings** with environment variables from Step 1-3
2. **Add authorized domains** to Firebase Console
3. **Redeploy** all three apps
4. **Test** the complete flow
