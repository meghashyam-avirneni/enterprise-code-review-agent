export class RateLimiter {
  private requestHistory: { timestamp: number; tokens: number }[] = [];

  constructor(
    private readonly maxRequestsPerMinute = 60,
    private readonly maxTokensPerMinute = 100000
  ) {}

  private pruneOldRecords(): void {
    const oneMinuteAgo = Date.now() - 60000;
    this.requestHistory = this.requestHistory.filter(r => r.timestamp > oneMinuteAgo);
  }

  canProceed(tokens = 0): boolean {
    this.pruneOldRecords();
    const requests = this.requestHistory.length;
    const usedTokens = this.requestHistory.reduce((sum, r) => sum + r.tokens, 0);
    return requests < this.maxRequestsPerMinute && usedTokens + tokens <= this.maxTokensPerMinute;
  }

  async waitForSlot(tokens = 0): Promise<void> {
    while (!this.canProceed(tokens)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async waitForRateLimit(tokens = 0): Promise<void> {
    await this.waitForSlot(tokens);
  }

  acquire(tokens = 0): void {
    this.pruneOldRecords();
    this.requestHistory.push({ timestamp: Date.now(), tokens });
  }

  release(): void {
    this.pruneOldRecords();
  }
}
