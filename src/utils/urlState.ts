import { CelebrationData, DEFAULT_CELEBRATION } from '../types/celebration';

/**
 * Encodes celebration data to a URL hash
 */
export function encodeCelebrationToUrl(data: CelebrationData): string {
  try {
    const jsonStr = JSON.stringify(data);
    const base64 = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.href);
    url.hash = `surprise=${base64}`;
    return url.toString();
  } catch (err) {
    console.error('Failed to encode URL state:', err);
    return window.location.href;
  }
}

/**
 * Decodes celebration data from current URL hash or query param
 */
export function decodeCelebrationFromUrl(): CelebrationData | null {
  try {
    const hash = window.location.hash;
    if (hash && hash.includes('surprise=')) {
      const base64 = hash.split('surprise=')[1];
      if (base64) {
        const decoded = decodeURIComponent(atob(base64));
        const parsed = JSON.parse(decoded);
        return {
          ...DEFAULT_CELEBRATION,
          ...parsed,
          badges: Array.isArray(parsed.badges) ? parsed.badges : DEFAULT_CELEBRATION.badges,
          vibeScores: {
            ...DEFAULT_CELEBRATION.vibeScores,
            ...(parsed.vibeScores || {}),
          },
        };
      }
    }
  } catch (err) {
    console.error('Failed to decode URL state:', err);
  }
  return null;
}
