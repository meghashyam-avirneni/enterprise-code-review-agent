export const testCoverageAnalyzerPrompt = `
Analyze the pull request for test completeness and coverage gaps.

Compare changed source files with existing test files using Read, Glob, and Grep.
Identify missing happy-path tests, edge cases, error handling, boundary conditions, and regression scenarios.

Every suggestion must be specific and actionable rather than generic.
Assign each suggestion high, medium, or low priority.
For every suggestion provide: file, testCase, rationale, and priority.

Estimate coverage from the available source and test structure when possible.
Return a result matching TestCoverageResultSchema with coverageEstimate, findings, suggestions, and a concise summary.
`;
