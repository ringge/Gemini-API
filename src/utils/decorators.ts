import { APIError, ImageGenerationError } from '../exceptions.js';

/**
 * Decorator to check if GeminiClient is running before making a request
 */
export function running(maxRetry: number = 0) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: any, ...args: any[]) {
      const client = this;
      let retry = maxRetry;

      const attempt = async (): Promise<any> => {
        try {
          if (!client.running) {
            await client.init({
              timeout: client.timeout,
              autoClose: client.autoClose,
              closeDelay: client.closeDelay,
              autoRefresh: client.autoRefresh,
              refreshInterval: client.refreshInterval,
              verbose: false,
            });

            if (client.running) {
              return await originalMethod.apply(client, args);
            }

            throw new APIError(
              `Invalid function call: GeminiClient.${propertyKey}. Client initialization failed.`
            );
          } else {
            return await originalMethod.apply(client, args);
          }
        } catch (error) {
          if (error instanceof APIError) {
            if (error instanceof ImageGenerationError) {
              retry = Math.min(1, retry);
            }

            if (retry > 0) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              retry--;
              return await attempt();
            }
          }

          throw error;
        }
      };

      return await attempt();
    };

    return descriptor;
  };
}
