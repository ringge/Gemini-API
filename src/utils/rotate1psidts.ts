import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { Endpoint } from '../constants/endpoints.js';
import { Headers } from '../constants/headers.js';
import { AuthError } from '../exceptions.js';

export async function rotate1psidts(
  cookies: Record<string, string>,
  proxy?: string
): Promise<string | undefined> {
  const cookiePath =
    process.env.GEMINI_COOKIE_PATH || path.join(os.tmpdir(), 'gemini_webapi');

  await fs.mkdir(cookiePath, { recursive: true });

  const filename = `.cached_1psidts_${cookies['__Secure-1PSID']}.txt`;
  const filePath = path.join(cookiePath, filename);

  try {
    const stats = await fs.stat(filePath);
    const now = Date.now();
    const modifiedTime = stats.mtimeMs;

    if (now - modifiedTime <= 60000) {
      return;
    }
  } catch {
    // File doesn't exist, continue with rotation
  }

  try {
    const cookieString = Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');

    const response = await axios.post(Endpoint.ROTATE_COOKIES, '[000,"-0000000000000000000"]', {
      headers: {
        ...Headers.ROTATE_COOKIES,
        Cookie: cookieString,
      },
      httpsAgent: proxy
        ? new (await import('https-proxy-agent')).HttpsProxyAgent(proxy)
        : undefined,
      proxy: false,
      validateStatus: (status) => status < 500,
    });

    if (response.status === 401) {
      throw new AuthError('Cookie rotation failed: Unauthorized');
    }

    if (response.status !== 200) {
      throw new Error(`Cookie rotation failed with status ${response.status}`);
    }

    const setCookieHeaders = response.headers['set-cookie'] || [];
    for (const cookie of setCookieHeaders) {
      const match = cookie.match(/__Secure-1PSIDTS=([^;]+)/);
      if (match) {
        const new1psidts = match[1];
        await fs.writeFile(filePath, new1psidts, 'utf-8');
        return new1psidts;
      }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new Error(`Cookie rotation failed: ${error}`);
  }
}
