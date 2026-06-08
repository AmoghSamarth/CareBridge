const LOCAL_LANDING_URL = 'http://localhost:5174';
const DEFAULT_PROD_LANDING_URL = 'https://care-bridge-coral.vercel.app';

function isLocalHost() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

function isLocalUrl(url) {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/** Landing/marketing site URL — never send production users to localhost. */
export function getLandingUrl() {
  const envUrl = import.meta.env.VITE_LANDING_URL?.trim();
  const onLocalDev = isLocalHost();

  if (onLocalDev) {
    return envUrl || LOCAL_LANDING_URL;
  }

  if (envUrl && !isLocalUrl(envUrl)) {
    return envUrl;
  }

  return DEFAULT_PROD_LANDING_URL;
}
