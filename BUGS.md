# ffxiv-config — Known Quirks & Issues

> 🐞 **Living Source of Truth**: Known quirks, game client behaviors, and troubleshooting guides for **ffxiv-config**.
> High-level roadmap in [`ROADMAP.md`](./ROADMAP.md), active sprint in [`PLAN.md`](./PLAN.md), tasks in [`TODO.md`](./TODO.md).

---

## 🔍 Known Client Quirks & Behaviors

### 1. Character ID Folder Resolution (`FFXIV_CHR<id>`)
- **Quirk**: Square Enix stores character profiles in hexadecimal folders such as `FFXIV_CHR0040000001234567/`. When players have multiple characters, identifying the target folder can be confusing.
- **Workaround**: Check the "Date modified" timestamp on the folders immediately after logging out of the desired character, or sort folders by newest write time.

### 2. Multi-Monitor & DPI Scaling in ADDON.DAT
- **Quirk**: FFXIV's UI scaling setting (e.g. 100%, 150%, 200%) can offset HUD elements saved in `ADDON.DAT` if the user's resolution does not match the original layout (1440p).
- **Workaround**: Adjust UI scaling under System Configuration > Display Settings > High Resolution UI Settings, or use the HUD Layout editor in-game to snap elements to your screen boundaries.

### 3. Keybind Conflicts with Windows/Discord Overlays
- **Quirk**: Extended hotbars use Shift/Ctrl modifiers that may overlap with default overlay hotkeys (Discord, GeForce Experience).
- **Workaround**: Remap global overlay hotkeys in your recording or chat applications to avoid keybind clashing during combat encounters.
