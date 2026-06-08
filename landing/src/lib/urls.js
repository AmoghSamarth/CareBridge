const LOCAL_CLIENT_URL = 'http://localhost:5173';
const DEFAULT_PROD_CLIENT_URL = 'https://care-bridge-hp9u.vercel.app';

/** After sign-in on landing, send the user to the client app with a short-lived ID token. */
export async function redirectToClientAfterAuth(user) {
  try {
    const idToken = await user.getIdToken();
    const clientUrl = getClientUrl();
    console.log('🔄 Redirecting to client:', clientUrl);
    const url = new URL(clientUrl);
    url.searchParams.set('auth', idToken);
    const redirectUrl = url.toString();
    console.log('✓ Redirect URL:', redirectUrl);
    window.location.href = redirectUrl;
  } catch (error) {
    console.error('❌ Redirect error:', error);
    throw error;
  }
}

function isLocalHost() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

function isLocalUrl(url) {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/** Client app URL — avoids redirecting to localhost when landing is deployed on Vercel. */
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
