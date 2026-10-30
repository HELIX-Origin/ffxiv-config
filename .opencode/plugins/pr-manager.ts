import { Plugin } from "@opencode/plugin"
import { loadConfig } from "./_config"

// ── Config ──────────────────────────────────────────────────────────────

export interface PrManagerConfig {
  enabled: boolean
  debug: boolean
  contextThreshold: number
  marker: string
  reminderText: string
  mergeMethod: string
  autoMerge: boolean
}

const DEFAULT_CONFIG: PrManagerConfig = {
  enabled: true,
  debug: false,
  contextThreshold: 30_000,
  marker: "PR manager: ",
  mergeMethod: "squash",
  autoMerge: true,
  reminderText:
    "Use pull requests for all changes (no direct pushes to main). Create a PR with " +
    "gh pr create (conventional-commit title, linked issue). Wait for CI to pass, then merge " +
    "with gh pr merge --" + "squash --delete-branch (auto-merge when checks pass) instead of " +
    "merging manually. Keep PRs focused and reviewable.",
}

const MARKER_FALLBACK = "PR manager: "

export default Plugin.define({
  id: "helix.pr-manager",
  async setup(ctx) {
    const config = loadConfig("pr-manager", DEFAULT_CONFIG, ctx)
    if (!config.enabled) return () => {}

    const marker = config.marker || MARKER_FALLBACK

    await ctx.session.hook("context", (event) => {
      const e = event as { system?: { type: string; text: string }[]; messages?: unknown }
      if (!Array.isArray(e.system)) return
      if (e.system.some((b) => b.type === "text" && b.text.startsWith(marker))) return

      const chars = JSON.stringify(e.messages ?? "").length
      if (chars < config.contextThreshold) return

      e.system.push({
        type: "text",
        text: `${marker}${config.reminderText}`,
      })
    })

    return () => {}
  },
})