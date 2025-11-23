/**
 * HTTP headers for different API endpoints
 */
export const Headers = {
  GEMINI: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    Host: 'gemini.google.com',
    Origin: 'https://gemini.google.com',
    Referer: 'https://gemini.google.com/',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Same-Domain': '1',
  },
  ROTATE_COOKIES: {
    'Content-Type': 'application/json',
  },
  UPLOAD: {
    'Push-ID': 'feeds/mcudyrk2a4khkz',
  },
} as const;

export type HeadersType = typeof Headers;
