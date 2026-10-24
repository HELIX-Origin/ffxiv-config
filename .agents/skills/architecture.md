# Architecture — ffxiv-config

> Authoritative architectural specification for `ffxiv-config`.
> FFXIV HUD, hotbar, and macro configuration setup.

---

## 1. Directory Structure

```
ffxiv-config/
├── config/                     # Core exported FFXIV client configuration files
│   ├── ADDON.DAT               # HUD positioning and layout
│   ├── COMMON.DAT              # UI settings, character config, display options
│   ├── HOTBAR.DAT              # Cross hotbars and keybind bindings
│   ├── MACRO.DAT               # Combat and utility macros
│   └── GEARSET.DAT             # Job gear set definitions
├── docs/                       # Installation instructions and layout screenshots
├── ffxiv-config.zip            # Distribution release asset archive
└── README.md                   # Minimal entry point
```

---

## 2. Invariants

- Binary `.DAT` files are canonical client exports.
- Multi-monitor / resolution-aware HUD layout instructions provided in `docs/`.
