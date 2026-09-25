import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';

export const refactoringSuggester: AgentDefinition = {
  description: 'Identifies opportunities to improve code structure, clarity, maintainability, modernization, and design patterns.',
  prompt: 'Analyze the pull request for refactoring opportunities. Look for duplicated logic, poor structure, outdated patterns, unclear code, and opportunities to improve maintainability. Return actionable suggestions matching RefactoringResultSchema.',
  tools: ['Read', 'Glob', 'Grep'],
  model: 'inherit',
};
