export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  constructor(private readonly context = 'CodeReviewAgent') {}

  private write(level: LogLevel, message: string, metadata?: unknown): void {
    const timestamp = new Date().toISOString();
    const extra = metadata === undefined ? '' : ` ${JSON.stringify(metadata)}`;
    console.log(`[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}${extra}`);
  }

  debug(message: string, metadata?: unknown): void {
    this.write('debug', message, metadata);
  }

  info(message: string, metadata?: unknown): void {
    this.write('info', message, metadata);
  }

  warn(message: string, metadata?: unknown): void {
    this.write('warn', message, metadata);
  }

  error(message: string, metadata?: unknown): void {
    this.write('error', message, metadata);
  }
}
