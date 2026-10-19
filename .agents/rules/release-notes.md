# Rule: Release Notes Standards

**Status:** BINDING.
**Scope:** `ffxiv-config` repository.

---

## 1. Universal Semantic Versioning & Release Policy

- **SemVer Compliance**: All releases, git tags, changelog headers, and version manifests strictly adhere to Semantic Versioning (`vMAJOR.MINOR.PATCH`, e.g. `v0.1.0`, `v0.2.0`). Milestone-based tags are prohibited.
- **Packaged Resource Repository**: `ffxiv-config` distributes packaged configuration archives (`ffxiv-config.zip`) containing character configuration `.DAT` files as release assets.
- **Tag Pattern**: `v<major>.<minor>.<patch>` (e.g. `v0.2.0`).

---

## 2. Separation of Release Documents

1. **Release Notes** (GitHub Releases):
   - Detailed, human-readable overview explaining what changed, compatibility, and verification.
   - Published via GitHub Releases with attached `.zip` archive.
2. **Changelog Entry** (`CHANGELOG.md`):
   - Persistent chronological record in git history following [Keep a Changelog](https://keepachangelog.com/).
   - Grouped by release version with `Added`, `Changed`, `Fixed`, `Removed`, `Security`.

---

## 3. Release Structure Specification

Every release follows this structure:

```markdown
# ffxiv-config v<MAJOR.MINOR.PATCH>

> <One-sentence summary of the primary theme or update.>

| Attribute | Value |
|---|---|
| **Release Version** | `v<MAJOR.MINOR.PATCH>` |
| **Release Date** | YYYY-MM-DD |
| **Release Classification** | Packaged Configuration Archive |
| **License** | [MIT](https://opensource.org/licenses/MIT) |
| **Release Channel** | Stable / Production |

---

## Overview

<Clear summary explaining the release purpose and changes.>

---

## Highlights

- **<Key Change>** - <Description>

---

## Distribution & Assets

| Artifact Name | Platform / Target | Format |
|---|---|---|
| `ffxiv-config.zip` | Final Fantasy XIV (PC) | Zip Archive |

---

## What's Changed

### Added
- ...

### Changed
- ...

---

## Compatibility

| Surface / Dependency | Target Requirement | Status |
|---|---|---|
| Game Client | Final Fantasy XIV Dawntrail (8.x) | Verified |
| Supported Resolutions | 1080p, 1440p, 4K | Supported |
```
