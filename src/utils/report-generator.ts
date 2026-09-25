import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ReviewReport } from '../types/index.js';

export class ReportGenerator {
  constructor(private readonly outputDir = 'reports') {}

  async generate(report: ReviewReport): Promise<string> {
    await mkdir(this.outputDir, { recursive: true });

    const safeRepo = report.repository.replace(/[^a-zA-Z0-9._-]/g, '-');
    const filename = `${safeRepo}-pr-${report.pullRequest}.md`;
    const path = join(this.outputDir, filename);

    const markdown = this.toMarkdown(report);
    await writeFile(path, markdown, 'utf8');
    return path;
  }

  private toMarkdown(report: ReviewReport): string {
    const quality = report.codeQuality.findings.map(f => `- **[${f.severity.toUpperCase()}]** ${f.title} — ${f.file}${f.line ? `:${f.line}` : ''}\n  - ${f.description}\n  - Recommendation: ${f.recommendation}`).join('\n');
    const tests = report.testCoverage.suggestions.map(s => `- **[${s.priority.toUpperCase()}]** ${s.testCase} — ${s.file}\n  - ${s.rationale}`).join('\n');
    const refactoring = report.refactoring.suggestions.map(s => `- **[${s.priority.toUpperCase()}]** ${s.title} — ${s.file}${s.line ? `:${s.line}` : ''}\n  - ${s.description}\n  - Rationale: ${s.rationale}`).join('\n');

    return `# Enterprise Code Review Report

**Repository:** ${report.repository}
**Pull Request:** #${report.pullRequest}
**Title:** ${report.title}

## Summary
${report.summary}

## Code Quality
${report.codeQuality.summary}

${quality || '- No findings reported.'}

## Test Coverage
**Estimated coverage:** ${report.testCoverage.coverageEstimate}%

${report.testCoverage.summary}

${tests || '- No test suggestions reported.'}

## Refactoring
${report.refactoring.summary}

${refactoring || '- No refactoring suggestions reported.'}

`;
  }
}
