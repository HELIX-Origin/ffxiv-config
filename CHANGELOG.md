# Changelog

All notable changes to **ffxiv-config** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-10-19

### Added

- New high-resolution in-game HUD & hotbar preview asset (`.github/assets/preview.jpg`) linked in README via raw GitHub URL.
- Project-local agents ecosystem (`AGENTS.md`, `.agents/rules/local-conventions.md`, `.github/copilot-instructions.md`).
- Self-contained community-health suite (`CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `PRIVACY.md`, `TOS.md`, `GOVERNANCE.md`, `CITATION.cff`, `.github/pull_request_template.md`, and issue form templates).
- Dedicated project-local tracking ledgers (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, `HANDOFF.md`).

### Changed

- Updated character configuration `.DAT` files (`ADDON.DAT`, `CONTROL0.DAT`, `GEARSET.DAT`, `HOTBAR.DAT`, `ITEMFDR.DAT`, `ITEMODR.DAT`, `KEYBIND.DAT`, `MACRO.DAT`, `UISAVE.DAT`) with latest FFXIV Dawntrail (8.x) HUD layout, keybinds, and combat job hotbars.
- Standardized project license to [MIT](LICENSE) across `LICENSE`, `README.md`, `CITATION.cff`, and local agent files, matching upstream Fr4nsson FFC permissions with full attribution.
- Converted `README.md` to a minimal entry point linking to centralized documentation and technical wiki hubs.

## [0.1.0] - 2026-10-17

### Added

- Initial release of custom information-dense HUD and hotbar setup for Final Fantasy XIV based on Fr4nsson's FFC.
- Multi-resolution HUD configurations and initial combat job hotbars.
- Decoupled documentation structure targeting centralized documentation hub.
