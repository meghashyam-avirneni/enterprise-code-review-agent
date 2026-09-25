# Code Review Best Practices

## Purpose

Use this skill when reviewing JavaScript or TypeScript pull requests.

## Review priorities

1. Identify security vulnerabilities and unsafe input handling.
2. Identify correctness and reliability issues.
3. Identify performance problems.
4. Identify maintainability and readability problems.
5. Prefer concrete, actionable recommendations supported by the changed code.

## Security

- Check authentication and authorization boundaries.
- Check untrusted input and injection risks.
- Check secrets and sensitive data handling.
- Check unsafe filesystem, network, and process operations.

## TypeScript and JavaScript

- Prefer explicit types at important boundaries.
- Avoid unnecessary any types.
- Handle promises and errors explicitly.
- Avoid duplicated business logic.
- Keep functions focused and maintainable.

## Findings

Classify findings as high, medium, or low severity.
Do not report subjective style preferences as defects.
