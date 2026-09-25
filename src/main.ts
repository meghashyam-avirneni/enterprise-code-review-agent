import 'dotenv/config';
import { Orchestrator } from './orchestrator.js';
import { ReportGenerator } from './utils/report-generator.js';

const [owner, repo, prNumberStr] = process.argv.slice(2);

if (!owner || !repo || !prNumberStr) {
  console.error('Usage: npm run dev -- <owner> <repo> <pr-number>');
  process.exit(1);
}

const prNumber = Number.parseInt(prNumberStr, 10);

if (!Number.isInteger(prNumber) || prNumber <= 0) {
  console.error('PR number must be a positive integer.');
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY.');
  process.exit(1);
}

try {
  const orchestrator = new Orchestrator();
  const report = await orchestrator.reviewPullRequest(owner, repo, prNumber);

  const generator = new ReportGenerator('reports');
  const reportPath = await generator.generate(report);

  console.log(`Review completed successfully.`);
  console.log(`Report: ${reportPath}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
