import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ReviewReport } from '../types/index.js';

export class ReportGenerator {
  constructor(private readonly outputDir = 'reports') {}

  async generate(report: ReviewReport): Promise<string> {
    const paths = await this.generateAll(report);
    return paths[1];
  }

  async generateAll(report: ReviewReport): Promise<string[]> {
    await mkdir(this.outputDir, { recursive: true });

    const safeRepo = report.repository.replace(/[^a-zA-Z0-9._-]/g, '_');
    const baseName = `${safeRepo}_${report.pullRequest}`;

    const jsonPath = join(this.outputDir, `${baseName}.json`);
    const markdownPath = join(this.outputDir, `${baseName}.md`);
    const htmlPath = join(this.outputDir, `${baseName}.html`);

    await writeFile(
      jsonPath,
      JSON.stringify(report, null, 2),
      'utf8'
    );

    await writeFile(
      markdownPath,
      this.toMarkdown(report),
      'utf8'
    );

    await writeFile(
      htmlPath,
      this.toHtml(report),
      'utf8'
    );

    return [jsonPath, markdownPath, htmlPath];
  }

  private toMarkdown(report: ReviewReport): string {
    const quality = report.codeQuality.findings
      .map(
        f =>
          `- **[${f.severity.toUpperCase()}]** ${f.title} — ${f.file}${
            f.line ? `:${f.line}` : ''
          }\n  - ${f.description}\n  - Recommendation: ${f.recommendation}`
      )
      .join('\n');

    const tests = report.testCoverage.suggestions
      .map(
        s =>
          `- **[${s.priority.toUpperCase()}]** ${s.testCase} — ${s.file}\n  - ${s.rationale}`
      )
      .join('\n');

    const refactoring = report.refactoring.suggestions
      .map(
        s =>
          `- **[${s.priority.toUpperCase()}]** ${s.title} — ${s.file}${
            s.line ? `:${s.line}` : ''
          }\n  - ${s.description}\n  - Rationale: ${s.rationale}`
      )
      .join('\n');

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

  private toHtml(report: ReviewReport): string {
    const quality = report.codeQuality.findings
      .map(
        f => `
<li>
  <strong>[${this.escapeHtml(f.severity.toUpperCase())}] ${this.escapeHtml(f.title)}</strong>
  — ${this.escapeHtml(f.file)}${f.line ? `:${f.line}` : ''}
  <ul>
    <li>${this.escapeHtml(f.description)}</li>
    <li>Recommendation: ${this.escapeHtml(f.recommendation)}</li>
  </ul>
</li>`
      )
      .join('');

    const tests = report.testCoverage.suggestions
      .map(
        s => `
<li>
  <strong>[${this.escapeHtml(s.priority.toUpperCase())}] ${this.escapeHtml(s.testCase)}</strong>
  — ${this.escapeHtml(s.file)}
  <ul>
    <li>${this.escapeHtml(s.rationale)}</li>
  </ul>
</li>`
      )
      .join('');

    const refactoring = report.refactoring.suggestions
      .map(
        s => `
<li>
  <strong>[${this.escapeHtml(s.priority.toUpperCase())}] ${this.escapeHtml(s.title)}</strong>
  — ${this.escapeHtml(s.file)}${s.line ? `:${s.line}` : ''}
  <ul>
    <li>${this.escapeHtml(s.description)}</li>
    <li>Rationale: ${this.escapeHtml(s.rationale)}</li>
  </ul>
</li>`
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Review - ${this.escapeHtml(report.repository)} PR #${report.pullRequest}</title>
</head>
<body>
  <h1>Enterprise Code Review Report</h1>

  <p><strong>Repository:</strong> ${this.escapeHtml(report.repository)}</p>
  <p><strong>Pull Request:</strong> #${report.pullRequest}</p>
  <p><strong>Title:</strong> ${this.escapeHtml(report.title)}</p>

  <h2>Summary</h2>
  <p>${this.escapeHtml(report.summary)}</p>

  <h2>Code Quality</h2>
  <p>${this.escapeHtml(report.codeQuality.summary)}</p>
  <ul>
    ${quality || '<li>No findings reported.</li>'}
  </ul>

  <h2>Test Coverage</h2>
  <p><strong>Estimated coverage:</strong> ${report.testCoverage.coverageEstimate}%</p>
  <p>${this.escapeHtml(report.testCoverage.summary)}</p>
  <ul>
    ${tests || '<li>No test suggestions reported.</li>'}
  </ul>

  <h2>Refactoring</h2>
  <p>${this.escapeHtml(report.refactoring.summary)}</p>
  <ul>
    ${refactoring || '<li>No refactoring suggestions reported.</li>'}
  </ul>
</body>
</html>
`;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
