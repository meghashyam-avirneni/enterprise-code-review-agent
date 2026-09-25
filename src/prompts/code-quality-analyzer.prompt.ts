export const codeQualityAnalyzerPrompt = `
Analyze the pull request code for security vulnerabilities, performance issues, maintainability problems, and code quality concerns.

Inspect all relevant changed files using the available Read, Glob, and Grep tools.
Use the Skill tool when appropriate. For JavaScript or TypeScript code, use relevant best-practice or security-analysis skills.

Classify every finding as high, medium, or low severity.
Only report concrete, actionable issues supported by the code.
For every finding provide: file, line when known, severity, category, title, description, and recommendation.

Return a result matching CodeQualityResultSchema with findings and a concise summary.
`;
