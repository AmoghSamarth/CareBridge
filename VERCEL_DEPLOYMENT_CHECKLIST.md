# 🚀 Vercel Deployment Checklist - Auth Redirect

## ✅ Status: READY FOR DEPLOYMENT

All code for the redirect flow is **already implemented**. You just need to configure Vercel environment variables.

---

## 📋 What You Need to Do

### 1️⃣ Firebase Console - Add Authorized Domains

**URL:** https://console.firebase.google.com

1. Select `carebridge-3eec0` project
2. Go to **Build** > **Authentication** > **Settings** (gear icon, top right)
3. Scroll down to **Authorized domains** section
4. Click **Add domain**
5. Add these three domains:
   - `localhost`
   - `care-bridge-coral.vercel.app`
   - `care-bridge-hp9u.vercel.app`
6. Click **Save**

---

### 2️⃣ Vercel - Landing Page (`care-bridge-coral.vercel.app`)

**Go to:** https://vercel.com > Projects > care-bridge-coral

Click **Settings** > **Environment Variables**

Add these variables:

| Key | Value |
|-----|-------|
| `VITE_FIREBASE_API_KEY` | From your Firebase project settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | `carebridge-3eec0.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `carebridge-3eec0` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `carebridge-3eec0.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | From your Firebase project settings |
| `VITE_FIREBASE_APP_ID` | From your Firebase project settings |
| `VITE_CLIENT_URL` | `https://care-bridge-hp9u.vercel.app` |
| `VITE_API_URL` | `https://carebridge-server.vercel.app` |
| `VITE_GEMINI_API_KEY` | Your Gemini API key |

Then click **Redeploy** (or push a new commit to trigger rebuild)

---

### 3️⃣ Vercel - Client App (`care-bridge-hp9u.vercel.app`)

**Go to:** https://vercel.com > Projects > care-bridge-hp9u

Click **Settings** > **Environment Variables**

Add these variables:

| Key | Value |
|-----|-------|
| `VITE_FIREBASE_API_KEY` | From your Firebase project settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | `carebridge-3eec0.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `carebridge-3eec0` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `carebridge-3eec0.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | From your Firebase project settings |
| `VITE_FIREBASE_APP_ID` | From your Firebase project settings |
| `VITE_LANDING_URL` | `https://care-bridge-coral.vercel.app` |
| `VITE_API_URL` | `https://carebridge-server.vercel.app` |

Then click **Redeploy** (or push a new commit to trigger rebuild)

---

### 4️⃣ Vercel - Server (`carebridge-server.vercel.app`)

**Go to:** https://vercel.com > Projects > carebridge-server

Click **Settings** > **Environment Variables**

Add these variables:

| Key | Value |
|-----|-------|
| `FIREBASE_PROJECT_ID` | `carebridge-3eec0` |
| `FIREBASE_PRIVATE_KEY` | From Firebase Service Account JSON (full private key) |
| `FIREBASE_CLIENT_EMAIL` | From Firebase Service Account JSON |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `CORS_ORIGIN` | `https://care-bridge-hp9u.vercel.app` |

Then click **Redeploy** (or push a new commit to trigger rebuild)

---

## 🔐 Where to Find Firebase Credentials

1. Go to https://console.firebase.google.com
2. Select `carebridge-3eec0` project
3. Click ⚙️ > **Project Settings**
4. Tab: **Service Accounts**
5. Click **Generate New Private Key** (bottom button)
6. This downloads a JSON file with your credentials

Use these values:
- `FIREBASE_PRIVATE_KEY` = `private_key` field (with `\n` preserved)
- `FIREBASE_CLIENT_EMAIL` = `client_email` field
- `FIREBASE_PROJECT_ID` = `project_id` field

---

## 🧪 Testing the Flow

After deploying, test this flow:

1. **Open** https://care-bridge-coral.vercel.app
2. **Click** "Sign In"
3. **Complete** authentication (email or Google)
4. **Expected:** Browser redirects to https://care-bridge-hp9u.vercel.app?auth=...
5. **Expected:** Page shows loading spinner briefly
6. **Expected:** User is logged in and sees onboarding or home page

If this works, ✅ everything is configured correctly!

---

## 🔧 If Something Goes Wrong

### Issue: "Firebase auth not configured for this domain"
**Solution:** Go to Firebase Console > Authorization > Authorized Domains and add the domain

### Issue: Redirects but user not logged in on client
**Solution:** 
- Check browser console (F12) for errors
- Check that `VITE_API_URL` is correct on client
- Check server logs for `/api/auth/handoff` request

### Issue: CORS error from server
**Solution:**
- Check server's `CORS_ORIGIN` env var matches client URL
- Should be `https://care-bridge-hp9u.vercel.app`

### Issue: "Invalid or expired token" from server
**Solution:**
- Check Firebase Admin SDK credentials are correct
- Check `FIREBASE_PRIVATE_KEY` includes newlines (`\n`)

---

## 📝 Files Created

| File | Purpose |
|------|---------|
| `REDIRECT_SETUP.md` | Detailed setup guide with all info |
| `landing/vercel.json` | Vercel config for landing page |
| `client/vercel.json` | Vercel config for client app |
| `server/vercel.json` | Vercel config for server |
| `landing/.env.local` | Local dev template for landing |
| `client/.env.local` | Local dev template for client |
| `server/.env.local` | Local dev template for server |

---

## 🎯 Quick Summary

**Before this setup:**
- Landing page and client are separate apps
- No auth bridging between them

**After this setup:**
- User logs in on landing page
- Gets redirected to client app with auth token
- Client app verifies token and signs in user
- User is now authenticated in client app
- Seamless experience across both domains

---

## ✨ Next Steps

1. ✅ Add Firebase authorized domains
2. ✅ Set env vars on landing page Vercel project
3. ✅ Set env vars on client app Vercel project
4. ✅ Set env vars on server Vercel project
5. ✅ Trigger redeployment (or push new commit)
6. ✅ Test the complete flow

**Done!** 🎉
