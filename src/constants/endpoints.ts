/**
 * API endpoints for Gemini web app
 */
export const Endpoint = {
  GOOGLE: 'https://www.google.com',
  INIT: 'https://gemini.google.com/app',
  GENERATE:
    'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate',
  ROTATE_COOKIES: 'https://accounts.google.com/RotateCookies',
  UPLOAD: 'https://content-push.googleapis.com/upload',
  BATCH_EXEC: 'https://gemini.google.com/_/BardChatUi/data/batchexecute',
} as const;

export type EndpointKey = keyof typeof Endpoint;
