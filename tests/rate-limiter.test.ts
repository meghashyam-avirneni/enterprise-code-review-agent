import { describe, expect, it } from 'vitest';
import { RateLimiter } from '../src/utils/rate-limiter.js';

describe('RateLimiter', () => {
  it('allows a request when limits have not been reached', () => {
    const limiter = new RateLimiter(2, 2, 1000);
    expect(limiter.canProceed(100)).toBe(true);
  });

  it('rejects a request when the per-minute request limit is reached', async () => {
    const limiter = new RateLimiter(2, 1, 1000);
    await limiter.acquire(100);
    expect(limiter.canProceed(100)).toBe(false);
    limiter.release();
  });
});
