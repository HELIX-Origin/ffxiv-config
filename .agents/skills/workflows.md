# Workflows — ffxiv-config

> Authoritative development workflows and runbooks for `ffxiv-config`.

---

## 1. Updating Client Configuration Files

1. Export clean `.DAT` files from the updated FFXIV client session.
2. Copy `.DAT` files into `config/`.
3. Package the distribution archive:
   ```powershell
   Compress-Archive -Path config/* -DestinationPath ffxiv-config.zip -Force
   ```
4. Verify archive contents with `tar -tf ffxiv-config.zip`.
5. Update `CHANGELOG.md` with layout tweaks.

---

## 2. Preparing a Release

1. Verify `ffxiv-config.zip` is generated and non-empty.
2. Confirm SemVer version bump in `CHANGELOG.md`.
3. Attach `ffxiv-config.zip` to the GitHub Release.
