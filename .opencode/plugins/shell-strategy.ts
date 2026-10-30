import { Plugin } from "@opencode/plugin"
import { loadConfig } from "./_config"

// ── Config ──────────────────────────────────────────────────────────────

export interface ShellStrategyConfig {
  enabled: boolean
  debug: boolean
  contextThreshold: number
  marker: string
  reminderText: string
}

const DEFAULT_CONFIG: ShellStrategyConfig = {
  enabled: true,
  debug: false,
  contextThreshold: 30_000,
  marker: "Shell strategy: ",
  reminderText:
    "Non-interactive shell only. No editors (vim/nano) or pagers (less/more/man). " +
    "Use documented non-interactive flags (-y, --no-edit, --no-pager). " +
    "Fail fast on missing auth (sudo -n, ssh BatchMode). " +
    "Prefer OpenCode tools (Read/Write/Edit) over shell text manipulation. " +
    "Never pipe passwords. Use GIT_TERMINAL_PROMPT=0 for git.",
}

export default Plugin.define({
  id: "helix.shell-strategy",
  async setup(ctx) {
    const config = loadConfig("shell-strategy", DEFAULT_CONFIG, ctx)
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