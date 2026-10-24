# Local Conventions — ffxiv-config

> Authoritative conventions for `ffxiv-config`.
> FFXIV HUD, hotbar, and macro configuration setup (Dawntrail 8.x).

---

## 1. Binary Configuration Files

- The core assets are binary `.DAT` configuration files (`ADDON.DAT`, `COMMON.DAT`, `HOTBAR.DAT`, `MACRO.DAT`, `GEARSET.DAT`).
- **Never attempt to hand-edit binary `.DAT` files.** All updates must be exported cleanly from the FFXIV client.
- Packaged configuration bundles are zipped into `ffxiv-config.zip` for GitHub Release attachments.

---

## 2. Documentation & Layout Guides

- Documentation and user setup guides live under `docs/` or repository root.
- All guides must remain mod-agnostic and theme-neutral.
- Provide clear directory installation paths for Windows (`%USERPROFILE%\Documents\My Games\FINAL FANTASY XIV - A Realm Reborn\FFXIV_CHR...`).

---

## 3. Releases & Packaging

- Every release distributes a packaged `ffxiv-config.zip` asset.
- SemVer versioning: `vMAJOR.MINOR.PATCH`.
