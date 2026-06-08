import { signInWithCustomToken } from 'firebase/auth';

/** Complete cross-domain sign-in when redirected from the landing app with ?auth=<idToken>. */
export async function tryAuthHandoff(auth) {
  const params = new URLSearchParams(window.location.search);
  const idToken = params.get('auth');
  if (!idToken) return false;

  params.delete('auth');
  const cleanSearch = params.toString();
  const cleanUrl = cleanSearch
    ? `${window.location.pathname}?${cleanSearch}`
    : window.location.pathname;
  window.history.replaceState({}, '', cleanUrl);

  const apiUrl = import.meta.env.VITE_API_URL?.trim();
  if (!apiUrl) {
    console.warn('Auth handoff skipped: VITE_API_URL is not set');
    return false;
  }

  try {
    const res = await fetch(`${apiUrl}/api/auth/handoff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
      throw new Error(`Handoff request failed (${res.status})`);
    }

    const data = await res.json();
    if (!data.customToken) {
      throw new Error('No custom token returned');
    }

    await signInWithCustomToken(auth, data.customToken);
    return true;
  } catch (error) {
    console.error('Auth handoff failed:', error);
    return false;
  }
}
