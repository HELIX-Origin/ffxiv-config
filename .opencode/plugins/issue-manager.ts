import { Plugin } from "@opencode/plugin"
import { loadConfig } from "./_config"

// ── Config ──────────────────────────────────────────────────────────────

export interface IssueManagerConfig {
  enabled: boolean
  debug: boolean
  contextThreshold: number
  marker: string
  reminderText: string
  requireIssueForChanges: boolean
}

const DEFAULT_CONFIG: IssueManagerConfig = {
  enabled: true,
  debug: false,
  contextThreshold: 30_000,
  marker: "Issue manager: ",
  requireIssueForChanges: true,
  reminderText:
    "Track every update and bug fix with a GitHub issue. Before starting work, create or " +
    "reference an issue (gh issue create / gh issue view). Link commits and PRs to the issue " +
    "(Closes #N). Apply area/bug/enhancement labels. Close the issue when the fix ships. " +
    "Do not bundle unrelated changes under one issue.",
}

const MARKER_FALLBACK = "Issue manager: "

export default Plugin.define({
  id: "helix.issue-manager",
  async setup(ctx) {
    const config = loadConfig("issue-manager", DEFAULT_CONFIG, ctx)
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