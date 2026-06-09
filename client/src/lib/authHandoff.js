/** 
 * Auth handoff disabled — Firebase handles 
 * cross-domain auth persistence automatically.
 */
export async function tryAuthHandoff(auth) {
  return false;
}