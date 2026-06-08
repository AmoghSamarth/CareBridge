# 🔍 Debugging: Login Redirect Not Working

## ⚡ Quick Fix

The issue is most likely that **`VITE_CLIENT_URL` is not set on Vercel**.

### Step 1: Check Vercel Environment Variables

1. Go to https://vercel.com
2. Click **care-bridge-coral** project
3. Go to **Settings** → **Environment Variables**
4. **Look for `VITE_CLIENT_URL`**

If it's missing, add it:
- **Name:** `VITE_CLIENT_URL`
- **Value:** `https://care-bridge-hp9u.vercel.app`
- **Environments:** Production (or all)

5. Click **Save**
6. **Redeploy** the landing page

---

## 🧪 How to Debug

### Step 1: Open Browser Dev Tools
1. Visit https://care-bridge-coral.vercel.app
2. Press **F12** to open Developer Tools
3. Go to **Console** tab

### Step 2: Try to Sign In
1. Click "Sign In"
2. Complete authentication
3. **Watch the Console for messages**

You should see:
```
✓ Redirect URL: https://care-bridge-hp9u.vercel.app?auth=...
```

### Step 3: Check for Errors
If you see error messages like:
- `❌ Redirect error: ...`
- `Redirect failed: ...`
- `Check VITE_CLIENT_URL environment variable`

Then the issue is identified!

---

## 🔧 Common Issues & Fixes

### Issue 1: "VITE_CLIENT_URL is not set"

**Root Cause:** Environment variable not set on Vercel

**Fix:**
1. Go to Vercel project settings
2. Add `VITE_CLIENT_URL=https://care-bridge-hp9u.vercel.app`
3. Redeploy

### Issue 2: "Invalid URL" error in console

**Root Cause:** `VITE_CLIENT_URL` has wrong format

**Fix:**
- Make sure it starts with `https://`
- Make sure it ends with `.vercel.app` (no trailing slash)
- Correct format: `https://care-bridge-hp9u.vercel.app`

### Issue 3: Auth successful but no redirect

**Root Cause:** Either:
- VITE_CLIENT_URL not set (falls back to default which might be wrong)
- Or `redirectToClientAfterAuth()` not being called
- Or error being silently caught

**Fix:**
1. Check browser console (F12) for any error messages
2. Check Vercel env var is set correctly
3. Look for this log message:
   ```
   ✅ Google sign-in successful, redirecting...
   ```

### Issue 4: Redirects but shows different domain

**Root Cause:** `VITE_CLIENT_URL` is set to wrong URL

**Fix:**
- Check Vercel env var
- Must be exactly: `https://care-bridge-hp9u.vercel.app`
- NOT `https://care-bridge.vercel.app`
- NOT `https://care-bridge-hp9u.vercel.app/` (no trailing slash)

---

## 📋 Console Messages to Look For

### ✅ SUCCESS - You should see:
```
✓ Redirect URL: https://care-bridge-hp9u.vercel.app?auth=eyJhbGc...
[Automatic redirect happens]
```

### ❌ ERROR - If you see this:
```
❌ Redirect error: [object Object]
```
Then check the error details in console

### ❌ ERROR - If you see this:
```
Redirect failed: Invalid URL. Check VITE_CLIENT_URL environment variable.
```
Then `VITE_CLIENT_URL` is definitely not set correctly

---

## 🔗 Complete Debugging Checklist

- [ ] Opened browser console (F12)
- [ ] Clicked sign in and watched console
- [ ] Saw success or error message in console
- [ ] Noted the exact error message
- [ ] Went to Vercel settings for landing project
- [ ] Checked Environment Variables section
- [ ] Looked for `VITE_CLIENT_URL` variable
- [ ] Checked if it's set to `https://care-bridge-hp9u.vercel.app`
- [ ] Redeployed landing page after making changes

---

## 🆘 If Still Not Working

1. **Post the console error message** you see
2. **Post the Vercel env vars** you have set for landing page
3. **Post screenshot** of Vercel Environment Variables page

Then I can help debug further!

---

## 🎯 What Should Happen

1. ✅ User signs in on landing
2. ✅ See console message: `✓ Redirect URL: https://care-bridge-hp9u.vercel.app?auth=...`
3. ✅ Browser redirects automatically
4. ✅ User sees client app loading
5. ✅ User is logged in ✅

---

## 📝 Previous Changes Made

Just now, I added:
- Console logging to show exactly what's being redirected to
- Better error messages that mention `VITE_CLIENT_URL`
- Logs show when sign-in succeeds

Next deployment will have these improvements. After you redeploy, the errors will be much clearer!

---

## 🚀 Quick Action Plan

1. Check browser console after next login attempt
2. Screenshot any error message
3. Go to Vercel landing project settings
4. Check Environment Variables
5. Add or fix `VITE_CLIENT_URL=https://care-bridge-hp9u.vercel.app`
6. Redeploy landing page
7. Try login again
8. Should redirect now!
