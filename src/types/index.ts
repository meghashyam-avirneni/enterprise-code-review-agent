import { z } from 'zod';

export const SeveritySchema = z.enum(['high', 'medium', 'low']);

export const CodeQualityFindingSchema = z.object({
  file: z.string(),
  line: z.number().int().positive().optional(),
  severity: SeveritySchema,
  category: z.string(),
  title: z.string(),
  description: z.string(),
  recommendation: z.string(),
});

export const CodeQualityResultSchema = z.object({
  findings: z.array(CodeQualityFindingSchema),
  summary: z.string(),
});

export const TestSuggestionSchema = z.object({
  file: z.string(),
  testCase: z.string(),
  rationale: z.string(),
  priority: SeveritySchema,
});

export const TestCoverageResultSchema = z.object({
  coverageEstimate: z.number().min(0).max(100),
  findings: z.array(z.string()),
  suggestions: z.array(TestSuggestionSchema),
  summary: z.string(),
});

export const RefactoringSuggestionSchema = z.object({
  file: z.string(),
  line: z.number().int().positive().optional(),
  title: z.string(),
  description: z.string(),
  rationale: z.string(),
  priority: SeveritySchema,
});

export const RefactoringResultSchema = z.object({
  suggestions: z.array(RefactoringSuggestionSchema),
  summary: z.string(),
});

export const ReviewReportSchema = z.object({
  repository: z.string(),
  pullRequest: z.number().int().positive(),
  title: z.string(),
  summary: z.string(),
  codeQuality: CodeQualityResultSchema,
  testCoverage: TestCoverageResultSchema,
  refactoring: RefactoringResultSchema,
});

export type Severity = z.infer<typeof SeveritySchema>;
export type CodeQualityFinding = z.infer<typeof CodeQualityFindingSchema>;
export type CodeQualityResult = z.infer<typeof CodeQualityResultSchema>;
export type TestSuggestion = z.infer<typeof TestSuggestionSchema>;
export type TestCoverageResult = z.infer<typeof TestCoverageResultSchema>;
export type RefactoringSuggestion = z.infer<typeof RefactoringSuggestionSchema>;
export type RefactoringResult = z.infer<typeof RefactoringResultSchema>;
export type ReviewReport = z.infer<typeof ReviewReportSchema>;
