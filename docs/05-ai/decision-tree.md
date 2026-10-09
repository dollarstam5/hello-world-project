# AI Decision Tree

This document helps AI agents decide the correct path for a task. It is designed to reduce guesswork and keep decisions aligned with project rules.

## Decision flow

### 1. Is the ask clear and documented?

- Yes: continue with the lowest relevant architectural layer.
- No: stop and gather the missing requirements before coding.

### 2. Does an existing pattern already cover this?

- Yes: reuse the existing pattern instead of inventing a new one.
- No: add a minimal, consistent abstraction only when justified.

### 3. Does the change affect a business domain?

- Yes: respect the domain boundaries and update the relevant docs.
- No: check whether the change belongs in shared, platform, or infrastructure code.

### 4. Does the change affect security or data integrity?

- Yes: review the security rules and validation requirements before implementation.
- No: proceed with standard engineering checks.

### 5. Does the change require API or schema changes?

- Yes: update the API or database documentation and verify compatibility.
- No: keep the scope narrow and avoid silent side effects.

### 6. Can the change be validated with a focused test?

- Yes: validate with the smallest relevant check.
- No: document the limitation and provide a clear rationale.

## Final principle

When uncertain, the AI must prefer existing project rules over a new solution. If a decision is not supported by docs or code, the responsible action is to flag the ambiguity instead of guessing.
