---
name: auto-review
description: Automatically review code for maintainability, performance, and security. Use when the user asks for code review, wants to check code quality, or types /auto-review.
---

Perform a comprehensive code review across three dimensions: **maintainability**, **performance**, and **security**. The user may provide specific files, a diff, or ask you to review the current working changes.

## Step 1: Gather Context

Determine what to review:
- If the user specified files or code snippets, review those.
- If no target is specified, run `git diff HEAD` to get uncommitted changes. If there are none, run `git diff HEAD~1` to get the latest commit.
- Read relevant files to understand context before evaluating.

## Step 2: Review Dimensions

Evaluate the code across these three dimensions:

### Maintainability
- **Readability**: Is the code easy to understand? Are variable/function names clear and descriptive?
- **Complexity**: Are functions/methods too long or deeply nested? Apply single responsibility principle.
- **Duplication**: Is there repeated logic that should be abstracted?
- **Dead code**: Are there unused variables, imports, or functions?
- **Comments**: Are complex sections explained? Are comments outdated or misleading?
- **Consistency**: Does the code follow the existing style conventions in the codebase?

### Performance
- **Algorithm complexity**: Are there O(n²) or worse loops that could be optimized?
- **Database queries**: Are there N+1 query problems? Missing indexes? Unnecessary queries in loops?
- **Memory usage**: Are large objects held in memory unnecessarily? Memory leaks?
- **Async/concurrency**: Are there blocking calls that should be async? Missing parallelization?
- **Caching**: Are expensive operations repeated when results could be cached?
- **Bundle size**: (Frontend) Are large dependencies imported when smaller alternatives exist?

### Security
- **Injection vulnerabilities**: SQL injection, command injection, XSS, SSTI.
- **Authentication/Authorization**: Are endpoints protected? Is access control correctly enforced?
- **Sensitive data exposure**: Are secrets, tokens, or PII logged or returned in responses?
- **Input validation**: Is user input validated and sanitized before use?
- **Dependency vulnerabilities**: Are there known vulnerable packages?
- **Insecure defaults**: Weak crypto, missing HTTPS enforcement, permissive CORS.

## Step 3: Output Format

Present the review in this structure:

```
## Code Review: [file name or "Current Changes"]

### Summary
[2-3 sentence overall assessment]

### Maintainability
**Severity**: [High / Medium / Low / None]
[Issues found, or "No issues found."]

### Performance  
**Severity**: [High / Medium / Low / None]
[Issues found, or "No issues found."]

### Security
**Severity**: [High / Medium / Low / None]
[Issues found, or "No issues found."]

### Recommendations
[Prioritized list of concrete fixes, most critical first. Include file path and line number for each issue.]
```

## Severity Guidelines
- **High**: Must fix before merging — data loss, security breach, or serious degradation risk.
- **Medium**: Should fix soon — technical debt that compounds or edge-case bugs.
- **Low**: Nice to have — style, minor optimizations, or non-urgent improvements.
- **None**: No issues found in this dimension.

## Rules
- Be specific: always cite file paths and line numbers.
- Be concise: flag real issues, not hypothetical ones.
- Be constructive: suggest the fix, not just the problem.
- Skip dimensions with no issues rather than padding with "looks good."
- If the codebase is large, focus on the changed/specified files and their immediate dependencies.
