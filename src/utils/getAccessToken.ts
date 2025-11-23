import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { Endpoint } from '../constants/endpoints.js';
import { Headers } from '../constants/headers.js';
import { AuthError } from '../exceptions.js';
import { logger } from './logger.js';

interface RequestResult {
  response: any;
  cookies: Record<string, string>;
}

async function sendRequest(
  cookies: Record<string, string>,
  proxy?: string
): Promise<RequestResult> {
  const response = await axios.get(Endpoint.INIT, {
    headers: Headers.GEMINI,
    httpsAgent: proxy
      ? new (await import('https-proxy-agent')).HttpsProxyAgent(proxy)
      : undefined,
    proxy: false,
    maxRedirects: 5,
  });

  const setCookieHeaders = response.headers['set-cookie'] || [];
  const responseCookies = { ...cookies };

  for (const cookie of setCookieHeaders) {
    const match = cookie.match(/([^=]+)=([^;]+)/);
    if (match) {
      responseCookies[match[1]] = match[2];
    }
  }

  return { response, cookies: responseCookies };
}

export async function getAccessToken(
  baseCookies: Record<string, string>,
  proxy?: string,
  verbose: boolean = false
): Promise<[string, Record<string, string>]> {
  const googleResponse = await axios.get(Endpoint.GOOGLE, {
    httpsAgent: proxy
      ? new (await import('https-proxy-agent')).HttpsProxyAgent(proxy)
      : undefined,
    proxy: false,
    maxRedirects: 5,
  });

  const extraCookies: Record<string, string> = {};
  if (googleResponse.status === 200) {
    const setCookieHeaders = googleResponse.headers['set-cookie'] || [];
    for (const cookie of setCookieHeaders) {
      const match = cookie.match(/([^=]+)=([^;]+)/);
      if (match) {
        extraCookies[match[1]] = match[2];
      }
    }
  }

  const tasks: Promise<RequestResult>[] = [];

  if (baseCookies['__Secure-1PSID'] && baseCookies['__Secure-1PSIDTS']) {
    tasks.push(sendRequest({ ...extraCookies, ...baseCookies }, proxy));
  } else if (verbose) {
    logger.debug(
      'Skipping loading base cookies. Either __Secure-1PSID or __Secure-1PSIDTS is not provided.'
    );
  }

  const cacheDir =
    process.env.GEMINI_COOKIE_PATH || path.join(os.tmpdir(), 'gemini_webapi');

  if (baseCookies['__Secure-1PSID']) {
    const filename = `.cached_1psidts_${baseCookies['__Secure-1PSID']}.txt`;
    const cacheFile = path.join(cacheDir, filename);

    try {
      const cached1psidts = await fs.readFile(cacheFile, 'utf-8');
      if (cached1psidts) {
        const cachedCookies = {
          ...extraCookies,
          ...baseCookies,
          '__Secure-1PSIDTS': cached1psidts.trim(),
        };
        tasks.push(sendRequest(cachedCookies, proxy));
      } else if (verbose) {
        logger.debug('Skipping loading cached cookies. Cache file is empty.');
      }
    } catch {
      if (verbose) {
        logger.debug('Skipping loading cached cookies. Cache file not found.');
      }
    }
  }

  if (tasks.length === 0) {
    throw new AuthError(
      'No valid cookies available for initialization. Please pass __Secure-1PSID and __Secure-1PSIDTS manually.'
    );
  }

  const results = await Promise.allSettled(tasks);

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === 'fulfilled') {
      const { response, cookies: requestCookies } = result.value;
      const match = response.data.match(/"SNlM0e":"(.*?)"/);
      if (match) {
        if (verbose) {
          logger.debug(
            `Init attempt (${i + 1}/${tasks.length}) succeeded. Initializing client...`
          );
        }
        return [match[1], requestCookies];
      } else if (verbose) {
        logger.debug(`Init attempt (${i + 1}/${tasks.length}) failed. Cookies invalid.`);
      }
    } else if (verbose) {
      logger.debug(
        `Init attempt (${i + 1}/${tasks.length}) failed with error: ${result.reason}`
      );
    }
  }

  throw new AuthError(
    `Failed to initialize client. SECURE_1PSIDTS could get expired frequently, please make sure cookie values are up to date. (Failed initialization attempts: ${tasks.length})`
  );
}
