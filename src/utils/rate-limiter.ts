export class RateLimiter {
  private requestHistory: { timestamp: number; tokens: number }[] = [];
  private activeRequests = 0;
  private waitQueue: Array<() => void> = [];

  constructor(
    private readonly maxConcurrentRequests = 5,
    private readonly maxRequestsPerMinute = 60,
    private readonly maxTokensPerMinute = 100000
  ) {}

  private pruneOldRecords(): void {
    const oneMinuteAgo = Date.now() - 60000;

    this.requestHistory = this.requestHistory.filter(
      record => record.timestamp > oneMinuteAgo
    );
  }

  canProceed(estimatedTokens = 0): boolean {
    this.pruneOldRecords();

    const requestsInWindow = this.requestHistory.length;

    const tokensInWindow = this.requestHistory.reduce(
      (total, record) => total + record.tokens,
      0
    );

    const hasConcurrentSlot =
      this.activeRequests < this.maxConcurrentRequests;

    const withinRequestLimit =
      requestsInWindow < this.maxRequestsPerMinute;

    const withinTokenLimit =
      tokensInWindow + estimatedTokens <= this.maxTokensPerMinute;

    return (
      hasConcurrentSlot &&
      withinRequestLimit &&
      withinTokenLimit
    );
  }

  private async waitForSlot(): Promise<void> {
    if (this.activeRequests < this.maxConcurrentRequests) {
      return;
    }

    await new Promise<void>(resolve => {
      this.waitQueue.push(resolve);
    });
  }

  private async waitForRateLimit(
    estimatedTokens = 0
  ): Promise<void> {
    while (!this.canProceed(estimatedTokens)) {
      this.pruneOldRecords();

      if (this.requestHistory.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      const oldestRequest = this.requestHistory[0];
      const waitTime = Math.max(
        100,
        oldestRequest.timestamp + 60000 - Date.now()
      );

      await new Promise(resolve =>
        setTimeout(resolve, Math.min(waitTime, 1000))
      );
    }
  }

  async acquire(estimatedTokens = 0): Promise<void> {
    await this.waitForSlot();

    await this.waitForRateLimit(estimatedTokens);

    this.activeRequests++;

    this.pruneOldRecords();

    this.requestHistory.push({
      timestamp: Date.now(),
      tokens: estimatedTokens
    });
  }

  release(): void {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }

    const next = this.waitQueue.shift();

    if (next) {
      next();
    }
  }

  async waitForSlotPublic(): Promise<void> {
    await this.waitForSlot();
  }

  async waitForRateLimitPublic(
    estimatedTokens = 0
  ): Promise<void> {
    await this.waitForRateLimit(estimatedTokens);
  }
}
