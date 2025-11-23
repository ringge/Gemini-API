import { logger } from './logger.js';

/**
 * Safely get a value from a nested list/array by a sequence of indices
 */
export function getNestedValue<T = any>(
  data: any,
  path: number[],
  defaultValue: T | null = null
): T | null {
  let current = data;

  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    try {
      if (current === null || current === undefined) {
        logger.debug(
          `Parsing failed at path ${JSON.stringify(path)} (index ${i}, key '${key}'): current value is null/undefined`
        );
        return defaultValue;
      }

      if (typeof current !== 'object' || !(key in current)) {
        logger.debug(
          `Parsing failed at path ${JSON.stringify(path)} (index ${i}, key '${key}'): key not found in current value`
        );
        return defaultValue;
      }

      current = current[key];
    } catch (error) {
      let currentRepr = JSON.stringify(current);
      if (currentRepr.length > 200) {
        currentRepr = currentRepr.substring(0, 197) + '...';
      }

      logger.debug(
        `${error instanceof Error ? error.name : 'Error'}: parsing failed at path ${JSON.stringify(path)} (index ${i}, key '${key}') while attempting to get value from \`${currentRepr}\``
      );
      return defaultValue;
    }
  }

  if (current === null && defaultValue !== null) {
    return defaultValue;
  }

  return current as T;
}

/**
 * Clean and extract the JSON content from a Google API response
 */
export function extractJsonFromResponse(text: string): any {
  if (typeof text !== 'string') {
    throw new TypeError(
      `Input text is expected to be a string, got ${typeof text} instead.`
    );
  }

  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    try {
      return JSON.parse(trimmed);
    } catch {
      continue;
    }
  }

  throw new Error('Could not find a valid JSON object or array in the response.');
}
