import { Plugin } from "@opencode/plugin"
import { loadConfig } from "./_config"

// ── Config ──────────────────────────────────────────────────────────────

export interface GitSafetyConfig {
  enabled: boolean
  debug: boolean
  contextThreshold: number
  marker: string
  reminderText: string
}

const DEFAULT_CONFIG: GitSafetyConfig = {
  enabled: true,
  debug: false,
  contextThreshold: 20_000,
  marker: "Git safety: ",
  reminderText:
    "Never run repository-mutating git commands (add, commit, push, pull, merge, " +
    "rebase, reset, stash, checkout, switch, clean, tag, branch, mv, rm, restore, cherry-pick, " +
    "revert) unless the user explicitly authorises that exact operation. " +
    "Read-only git commands (status, log, diff, show, ls-files, remote -v) are fine. " +
    "Use GIT_TERMINAL_PROMPT=0 for git HTTP operations.",
}

export default Plugin.define({
  id: "helix.git-safety",
  async setup(ctx) {
    const config = loadConfig("git-safety", DEFAULT_CONFIG, ctx)
    if (!config.enabled) return () => {}

    await ctx.session.hook("context", (event) => {
      const e = event as { system?: { type: string; text: string }[]; messages?: unknown }
      if (!Array.isArray(e.system)) return
      if (e.system.some((b) => b.type === "text" && b.text.startsWith(config.marker))) return

      const chars = JSON.stringify(e.messages ?? "").length
      if (chars < config.contextThreshold) return

      e.system.push({
        type: "text",
        text: `${config.marker}${config.reminderText}`,
      })
    })

    return () => {}
  },
})