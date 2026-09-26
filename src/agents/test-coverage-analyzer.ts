import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';

export const testCoverageAnalyzer: AgentDefinition = {
  description: 'Evaluates test completeness in pull requests and identifies missing coverage and actionable test cases.',
  prompt: 'Analyze the pull request for test coverage. Compare changed source code with existing tests, identify missing scenarios, edge cases, error paths, and suggest specific actionable tests. Return findings matching TestCoverageResultSchema.',
  tools: ['Read', 'Glob', 'Grep', 'Skill'],
  model: 'inherit',
};
