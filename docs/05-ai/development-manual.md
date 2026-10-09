# AI Development Manual

This document is the practical operating manual for AI-assisted development within Vitala.

## 1. Before coding

- read the relevant requirements and docs
- understand the scope and existing pattern
- identify the impacted module or domain
- decide whether the change is additive, corrective, or refactoring

## 2. While coding

- keep the patch scoped to the asked task
- avoid unrelated cleanup unless required by the fix
- respect architecture boundaries
- use the established naming and organization conventions
- add tests when behavior changes

## 3. After coding

- run the relevant checks
- validate the side effects
- update documentation if the change affects project conventions or interfaces
- summarize what changed and what was validated

## 4. Engineering expectations

AI changes should be:

- correct
- safe
- understandable
- maintainable
- minimally invasive

## 5. Error handling

If a task is ambiguous, incomplete, or contradictory:

1. identify the gap
2. consult the governing documentation
3. ask for clarification if needed
4. avoid inventing unsupported assumptions

## 6. Legacy source

This document consolidates the legacy AI framework guidance from the earlier docs in the repository, especially:

- `docs/00-AI-README.md.md`
- `docs/AI-RULEBOOK.md`
