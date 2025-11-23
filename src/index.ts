/**
 * Gemini WebAPI - Node.js/TypeScript wrapper for Google Gemini web app
 */

// Export main client (to be implemented)
// export { GeminiClient, ChatSession } from './client.js';

// Export types
export {
  Image,
  WebImage,
  GeneratedImage,
  Gem,
  GemJar,
  type GemInput,
  Candidate,
  ModelOutput,
  RPCData,
} from './types/index.js';

// Export constants
export { Endpoint } from './constants/endpoints.js';
export { GRPC } from './constants/grpc.js';
export { Headers } from './constants/headers.js';
export { Model, type ModelInput, type ModelConfig } from './constants/models.js';
export { ErrorCode } from './constants/errors.js';

// Export exceptions
export {
  AuthError,
  APIError,
  ImageGenerationError,
  GeminiError,
  TimeoutError,
  UsageLimitExceeded,
  ModelInvalid,
  TemporarilyBlocked,
} from './exceptions.js';

// Export utilities
export { logger, setLogLevel } from './utils/logger.js';
