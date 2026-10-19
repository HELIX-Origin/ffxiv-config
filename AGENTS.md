# ffxiv-config

Documentation site (Jekyll, theme-neutral content).

## Project-local agents

This repository ships its own self-contained agents ecosystem (`AGENTS.md`, `.agents/`) and
tracking files (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`). Keep them accurate as work progresses.

## Build & test

- `bundle exec jekyll build` / `bundle exec jekyll serve`
- Front matter validated by CI.

## Conventions

- Content is theme-neutral and mod-agnostic (no theme-specific tokens in docs).
- Theme specifics belong only in the catalogue.
- See `.agents/rules/local-conventions.md` and `.agents/rules/release-notes.md`.

## Invariants

MIT license, SemVer releases (`vMAJOR.MINOR.PATCH`), packaged assets policy, community-health files.
See `CONTRIBUTING.md` for the full contributor guidelines.