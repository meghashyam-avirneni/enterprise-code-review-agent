export enum ErrorCodes {
  AGENT_TIMEOUT = 'AGENT_TIMEOUT',
  RATE_LIMITED = 'RATE_LIMITED',
  MCP_ERROR = 'MCP_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN'
}

export class ReviewError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCodes,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ReviewError';
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 500
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) break;

      const backoff = delayMs * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 100;
      await new Promise(resolve => setTimeout(resolve, backoff + jitter));
    }
  }

  throw lastError instanceof Error ? lastError : new ReviewError('Operation failed', ErrorCodes.UNKNOWN, lastError);
}

export function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new ReviewError('Operation timed out', ErrorCodes.AGENT_TIMEOUT)), timeoutMs);
    })
  ]);
}
