import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';

export const codeQualityAnalyzer: AgentDefinition = {
  description: 'Analyzes pull request code for security vulnerabilities, performance issues, maintainability problems, and code quality concerns.',
  prompt: 'Analyze the provided pull request code for security, performance, maintainability, and code quality issues. Use the Skill tool when appropriate, especially javascript-best-practices, typescript-patterns, or security-analysis. Return findings matching CodeQualityResultSchema.',
  tools: ['Read', 'Glob', 'Grep', 'Skill'],
  model: 'inherit',
};
