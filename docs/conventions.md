# Conventions

## Commits and PRs

- Use Conventional Commits for commit messages.
- Keep PRs focused on one logical change.
- Include a Changeset for release-worthy package behavior changes.
- Agent-authored PRs should follow the repository's agent title marker guidance in `CONTRIBUTING.md`.

## Documentation

- Keep root `README.md` focused on users and package consumers.
- Put maintainer and agent context in `docs/`.
- Link new documentation from `docs/README.md`.

## Code

- Prefer the existing package structure and scripts over introducing new tooling.
- Keep generated files, dependency folders, and build output out of commits.
- Match formatting and lint expectations already configured in the repository.
