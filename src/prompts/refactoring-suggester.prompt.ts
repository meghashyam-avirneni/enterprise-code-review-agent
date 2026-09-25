export const refactoringSuggesterPrompt = `
Analyze the pull request for opportunities to improve code structure, clarity, maintainability, and modernization.

Inspect changed files using Read, Glob, and Grep.
Look for duplicated logic, overly complex code, unclear naming, poor separation of concerns, outdated patterns, and opportunities to apply appropriate design patterns.

Distinguish concrete refactoring opportunities from subjective style preferences.
Assign each suggestion high, medium, or low priority.
For every suggestion provide: file, line when known, title, description, rationale, and priority.

Return a result matching RefactoringResultSchema with suggestions and a concise summary.
`;
