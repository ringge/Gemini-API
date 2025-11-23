/**
 * Custom error classes for Gemini API
 */

/**
 * Exception for authentication errors caused by invalid credentials/cookies.
 */
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * Exception for package-level errors which need to be fixed in future development
 * (e.g. validation errors).
 */
export class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

/**
 * Exception for generated image parsing errors.
 */
export class ImageGenerationError extends APIError {
  constructor(message: string) {
    super(message);
    this.name = 'ImageGenerationError';
    Object.setPrototypeOf(this, ImageGenerationError.prototype);
  }
}

/**
 * Exception for errors returned from Gemini server which are not handled by the package.
 */
export class GeminiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiError';
    Object.setPrototypeOf(this, GeminiError.prototype);
  }
}

/**
 * Exception for request timeouts.
 */
export class TimeoutError extends GeminiError {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Exception for model usage limit exceeded errors.
 */
export class UsageLimitExceeded extends GeminiError {
  constructor(message: string) {
    super(message);
    this.name = 'UsageLimitExceeded';
    Object.setPrototypeOf(this, UsageLimitExceeded.prototype);
  }
}

/**
 * Exception for invalid model header string errors.
 */
export class ModelInvalid extends GeminiError {
  constructor(message: string) {
    super(message);
    this.name = 'ModelInvalid';
    Object.setPrototypeOf(this, ModelInvalid.prototype);
  }
}

/**
 * Exception for 429 Too Many Requests when IP is temporarily blocked.
 */
export class TemporarilyBlocked extends GeminiError {
  constructor(message: string) {
    super(message);
    this.name = 'TemporarilyBlocked';
    Object.setPrototypeOf(this, TemporarilyBlocked.prototype);
  }
}
