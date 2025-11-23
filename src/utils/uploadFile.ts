import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import FormData from 'form-data';
import { Endpoint } from '../constants/endpoints.js';
import { Headers } from '../constants/headers.js';

export async function uploadFile(filePath: string, proxy?: string): Promise<string> {
  const fileBuffer = await fs.readFile(filePath);

  const form = new FormData();
  form.append('file', fileBuffer, path.basename(filePath));

  const response = await axios.post(Endpoint.UPLOAD, form, {
    headers: {
      ...Headers.UPLOAD,
      ...form.getHeaders(),
    },
    httpsAgent: proxy
      ? new (await import('https-proxy-agent')).HttpsProxyAgent(proxy)
      : undefined,
    proxy: false,
    maxRedirects: 5,
  });

  return response.data;
}

export function parseFileName(filePath: string): string {
  const resolvedPath = path.resolve(filePath);

  try {
    require('fs').statSync(resolvedPath);
  } catch {
    throw new Error(`${filePath} is not a valid file.`);
  }

  return path.basename(resolvedPath);
}
