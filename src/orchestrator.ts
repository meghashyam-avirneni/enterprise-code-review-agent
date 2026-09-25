import { query } from '@anthropic-ai/claude-agent-sdk';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { ReviewReportSchema, type ReviewReport } from './types/index.js';
import { codeQualityAnalyzer, testCoverageAnalyzer, refactoringSuggester } from './agents/index.js';
import { mcpServers } from './config/mcp.config.js';
import { orchestratorPrompt } from './prompts/index.js';

export class Orchestrator {
  async reviewPullRequest(owner: string, repo: string, pullRequest: number): Promise<ReviewReport> {
    const prompt = `${orchestratorPrompt}

Repository: ${owner}/${repo}
Pull request number: ${pullRequest}`;

    const result = query({
      prompt,
      options: {
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
        permissionMode: 'bypassPermissions',
        allowDangerouslySkipPermissions: true,
        maxTurns: 30,
        allowedTools: ['Task', 'Read', 'Glob', 'Grep', 'Skill'],
        agents: {
          'code-quality-analyzer': codeQualityAnalyzer,
          'test-coverage-analyzer': testCoverageAnalyzer,
          'refactoring-suggester': refactoringSuggester
        },
        mcpServers,
        outputFormat: {
          type: 'json_schema',
          schema: zodToJsonSchema(ReviewReportSchema, { $refStrategy: 'root' })
        }
      }
    });

    for await (const message of result) {
      if (message.type === 'result' && 'structured_output' in message && message.structured_output) {
        const parsed = ReviewReportSchema.safeParse(message.structured_output);
        if (!parsed.success) {
          throw new Error(`Structured output validation failed: ${parsed.error.message}`);
        }
        return parsed.data;
      }
    }

    throw new Error('No structured review report was returned by the orchestrator.');
  }
}
