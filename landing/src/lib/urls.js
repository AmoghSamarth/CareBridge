const LOCAL_CLIENT_URL = 'http://localhost:5173';
const DEFAULT_PROD_CLIENT_URL = 'https://care-bridge-hp9u.vercel.app';

function isLocalHost() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

function isLocalUrl(url) {
  return /localhost|127\.0\.0\.1/i.test(url);
}

export function getClientUrl() {
  const envUrl = import.meta.env.VITE_CLIENT_URL?.trim();
  const onLocalDev = isLocalHost();

  if (onLocalDev) {
    return envUrl || LOCAL_CLIENT_URL;
  }

  if (envUrl && !isLocalUrl(envUrl)) {
    return envUrl;
  }

  return DEFAULT_PROD_CLIENT_URL;
}

export function getLandingUrl() {
  return window.location.origin;
}

export async function redirectToClientAfterAuth(user) {
  try {
    const idToken = await user.getIdToken(true);
    const url = new URL(getClientUrl());
    url.searchParams.set('auth', idToken);
    window.location.href = url.toString();
  } catch (err) {
    window.location.href = getClientUrl();
  }
}