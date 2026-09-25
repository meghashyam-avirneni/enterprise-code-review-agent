import { describe, expect, it } from 'vitest';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { ReviewReportSchema } from '../src/types/index.js';

const validReport = {
  repository: 'octocat/Hello-World',
  pullRequest: 1,
  title: 'Improve greeting',
  summary: 'Review completed.',
  codeQuality: {
    findings: [],
    summary: 'No quality issues found.'
  },
  testCoverage: {
    coverageEstimate: 80,
    findings: [],
    suggestions: [],
    summary: 'Coverage is reasonable.'
  },
  refactoring: {
    suggestions: [],
    summary: 'No refactoring suggestions.'
  }
};

describe('ReviewReportSchema', () => {
  it('accepts a valid report', () => {
    expect(ReviewReportSchema.safeParse(validReport).success).toBe(true);
  });

  it('rejects a missing repository', () => {
    const invalid = { ...validReport, repository: undefined };
    expect(ReviewReportSchema.safeParse(invalid).success).toBe(false);
  });

  it('rejects an invalid pull request number', () => {
    const invalid = { ...validReport, pullRequest: 0 };
    expect(ReviewReportSchema.safeParse(invalid).success).toBe(false);
  });

  it('rejects coverage outside 0 to 100', () => {
    const invalid = {
      ...validReport,
      testCoverage: { ...validReport.testCoverage, coverageEstimate: 101 }
    };
    expect(ReviewReportSchema.safeParse(invalid).success).toBe(false);
  });

  it('accepts an empty findings result', () => {
    expect(ReviewReportSchema.safeParse(validReport).success).toBe(true);
  });

  it('generates a JSON schema', () => {
    const schema = zodToJsonSchema(ReviewReportSchema, { $refStrategy: "root" });
    expect(schema).toHaveProperty('properties');
  });
});
