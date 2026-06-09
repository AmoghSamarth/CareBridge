export async function redirectToClientAfterAuth(user) {
  try {
    const idToken = await user.getIdToken(true);
    const url = new URL(getClientUrl());
    url.searchParams.set('auth', idToken);
    window.location.href = url.toString();
  } catch (err) {
    // Fallback — redirect without token
    window.location.href = getClientUrl();
  }
}