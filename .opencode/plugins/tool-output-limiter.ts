import { Plugin } from "@opencode/plugin"
import { loadConfig } from "./_config"

// ── Config ──────────────────────────────────────────────────────────────

export interface ToolOutputLimiterConfig {
  enabled: boolean
  debug: boolean
  contextThreshold: number
  marker: string
  reminderText: string
  maxOutputLines: number
  maxOutputBytes: number
}

const DEFAULT_CONFIG: ToolOutputLimiterConfig = {
  enabled: true,
  debug: false,
  contextThreshold: 100_000,
  marker: "Tool output: ",
  reminderText:
    "Keep tool output minimal. Truncate large file reads. " +
    "Prefer targeted searches (grep/glob) over full-file dumps. " +
    "Do not re-read files whose contents are already in context. " +
    "Summarise tool results instead of quoting them verbatim.",
  maxOutputLines: 1500,
  maxOutputBytes: 51200,
}

export default Plugin.define({
  id: "helix.tool-output-limiter",
  async setup(ctx) {
    const config = loadConfig("tool-output-limiter", DEFAULT_CONFIG, ctx)
    if (!config.enabled) return () => {}

    await ctx.session.hook("context", (event) => {
      const e = event as { system?: { type: string; text: string }[]; messages?: unknown }
      if (!Array.isArray(e.system)) return
      if (e.system.some((b) => b.type === "text" && b.text.startsWith(config.marker))) return

      const chars = JSON.stringify(e.messages ?? "").length
      if (chars < config.contextThreshold) return

      e.system.push({
        type: "text",
        text: `${config.marker}${config.reminderText} (max ${config.maxOutputLines} lines / ${config.maxOutputBytes} bytes per tool output)`,
      })
    })

    return () => {}
  },
})