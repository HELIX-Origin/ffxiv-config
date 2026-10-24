# Verification Gate — ffxiv-config

> Authoritative verification gate for `ffxiv-config`.

---

## 1. Integrity Verification

- Ensure all exported `.DAT` configuration files exist in the distribution directory:
  - `ADDON.DAT` (HUD layout)
  - `COMMON.DAT` (Character configuration)
  - `HOTBAR.DAT` (Action bars)
  - `MACRO.DAT` (User macros)
  - `GEARSET.DAT` (Gear sets)
- Verify `ffxiv-config.zip` archive integrity:
  ```powershell
  # Test zip archive integrity
  tar -tf ffxiv-config.zip
  ```

---

## 2. Documentation & Links Check

- Verify all markdown documentation files render cleanly with valid GitHub Flavored Markdown.
- Ensure no broken internal relative links.
