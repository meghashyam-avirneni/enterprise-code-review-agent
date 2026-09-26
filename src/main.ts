import 'dotenv/config';
import { Orchestrator } from './orchestrator.js';
import { ReportGenerator } from './utils/report-generator.js';

const [owner, repo, prNumberStr] = process.argv.slice(2);

if (!owner || !repo || !prNumberStr) {
  console.error('Usage: npm run dev -- <owner> <repo> <pr-number>');
  process.exit(1);
}

if (!/^\d+$/.test(prNumberStr)) {
  console.error('PR number must be a valid positive integer.');
  console.error('Example: npm run dev -- octocat Hello-World 1');
  process.exit(1);
}

const prNumber = Number(prNumberStr);

if (!Number.isSafeInteger(prNumber) || prNumber <= 0) {
  console.error('PR number must be a safe positive integer.');
  console.error('Example: npm run dev -- octocat Hello-World 1');
  process.exit(1);
}

if (!process.env.GITHUB_TOKEN) {
  console.error('Missing GITHUB_TOKEN. Set it to a GitHub personal access token with permission to read pull requests.');
  console.error('Example: GITHUB_TOKEN=ghp_xxx npm run dev -- octocat Hello-World 1');
  process.exit(1);
}

const hasAnthropicAPI = Boolean(process.env.ANTHROPIC_API_KEY);

const hasAWSCredentials = Boolean(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY
);

if (!hasAnthropicAPI && !hasAWSCredentials) {
  console.error('Authentication required. Set one of:');
  console.error('  - ANTHROPIC_API_KEY, or');
  console.error(
    '  - AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY + AWS_REGION'
  );
  process.exit(1);
}

if (hasAWSCredentials && !process.env.AWS_REGION) {
  console.error(
    'AWS_REGION is required when using AWS authentication.'
  );
  process.exit(1);
}

console.log(
  `Using ${hasAnthropicAPI ? 'Anthropic API' : 'AWS Bedrock'} authentication.`
);

const model = process.env.ANTHROPIC_MODEL;

if (!model) {
  console.error('Missing ANTHROPIC_MODEL.');
  console.error('For Anthropic API, set ANTHROPIC_MODEL to an available Claude model.');
  console.error('For AWS Bedrock, set ANTHROPIC_MODEL to the available Bedrock model ID.');
  process.exit(1);
}

console.log(`Using model: ${model}`);

try {
  const orchestrator = new Orchestrator();

  const report = await orchestrator.reviewPullRequest(
    owner,
    repo,
    prNumber
  );

  const generator = new ReportGenerator('reports');
  const reportPaths = await generator.generateAll(report);

  console.log('Review completed successfully.');

  for (const reportPath of reportPaths) {
    console.log(`Report: ${reportPath}`);
  }
} catch (error) {
  console.error(
    `Review failed: ${error instanceof Error ? error.message : String(error)}`
  );
  process.exit(1);
}
