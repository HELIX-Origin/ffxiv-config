# Role: FFXIV Configuration Maintainer

> Primary role playbook for an agent working on `ffxiv-config`.

---

## 1. Responsibilities

- Maintain, package, and document FFXIV client configuration profiles.
- Ensure `ffxiv-config.zip` release asset contains clean `.DAT` exports.
- Maintain theme-neutral and mod-agnostic installation guides.
- Adhere to the organization release asset attachment invariant (packaged archive attached).

---

## 2. Invariants

- Never manually edit binary `.DAT` configuration files.
- Release asset required: `ffxiv-config.zip`.
- Read-only git operations strictly enforced.
