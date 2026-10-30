import { Plugin } from "@opencode/plugin"
import { loadConfig, resolveLimit } from "./_config"

// ── Config ──────────────────────────────────────────────────────────────

export interface ContextManagerConfig {
  enabled: boolean
  debug: boolean
  warnThreshold: number | `${number}%`
  hardThreshold: number | `${number}%`
  compactThreshold: number | `${number}%`
  modelLimits?: Record<string, { warn?: number | `${number}%`; hard?: number | `${number}%`; compact?: number | `${number}%` }>
  compression: {
    mode: "auto" | "manual" | "disabled"
    permission: "ask" | "allow" | "deny"
    showCompression: boolean
    summaryBuffer: boolean
    nudgeFrequency: number
    iterationNudgeThreshold: number
    nudgeForce: "strong" | "soft"
    protectedTools: string[]
    protectTags: boolean
    protectUserMessages: boolean
    summaryTemplate: string
  }
  turnProtection: {
    enabled: boolean
    turns: number
  }
  protectedFilePatterns: string[]
}

const DEFAULT_CONFIG: ContextManagerConfig = {
  enabled: true,
  debug: false,
  warnThreshold: "50%",
  hardThreshold: "80%",
  compactThreshold: "70%",
  compression: {
    mode: "auto",
    permission: "allow",
    showCompression: false,
    summaryBuffer: true,
    nudgeFrequency: 5,
    iterationNudgeThreshold: 15,
    nudgeForce: "soft",
    protectedTools: ["task", "skill", "todowrite", "todoread", "compress", "batch", "plan_enter", "plan_exit", "write", "edit"],
    protectTags: false,
    protectUserMessages: false,
    summaryTemplate: "Preserve key decisions, file paths, and open questions. Drop redundant tool output and intermediate reasoning.",
  },
  turnProtection: {
    enabled: false,
    turns: 4,
  },
  protectedFilePatterns: [],
}

const MARKER = "Context manager: "

function serializedLength(value: unknown): number {
  try { return JSON.stringify(value)?.length ?? 0 } catch { return 0 }
}

function resolveThresholds(config: ContextManagerConfig, total: number, modelID?: string) {
  const modelLimits = modelID ? config.modelLimits?.[modelID] : undefined
  const warn = resolveLimit(modelLimits?.warn ?? config.warnThreshold, total)
  const hard = resolveLimit(modelLimits?.hard ?? config.hardThreshold, total)
  const compact = resolveLimit(modelLimits?.compact ?? config.compactThreshold, total)
  return { warn, hard, compact }
}

export default Plugin.define({
  id: "helix.context-manager",
  async setup(ctx) {
    const config = loadConfig("context-manager", DEFAULT_CONFIG, ctx)

    if (!config.enabled) return () => {}

    const totalBudget = 200_000 // approximate token budget for context window

    // Track context budget on every agent-loop request
    await ctx.session.hook("context", (event) => {
      const e = event as { system?: { type: string; text: string }[]; messages?: unknown; sessionID?: string; model?: { id?: string } }
      if (!Array.isArray(e.system)) return
      if (e.system.some((b) => b.type === "text" && b.text.startsWith(MARKER))) return

      const chars = serializedLength(e.messages)
      const modelID = e.model?.id
      const { warn, hard, compact } = resolveThresholds(config, totalBudget, modelID)

      if (chars < warn) return

      const level = chars >= hard ? "critical" : "elevated"
      const tokens = Math.round(chars / 4)
      e.system.push({
        type: "text",
        text:
          `${MARKER}${level} (~${tokens} tokens of history). ` +
          "Work in small, verified steps. Do not re-read files or re-run commands " +
          "whose results are already summarised. Prefer targeted searches over full-file dumps. " +
          "Record durable findings in tracking docs. Prefer a short checkpoint over a long narrative.",
      })

      // Auto-trigger compaction when history exceeds the compact threshold
      if (config.compression.mode === "auto" && chars >= compact && e.sessionID) {
        if (config.compression.permission === "allow" || config.compression.permission === "ask") {
          void ctx.session.compact({ sessionID: e.sessionID, delivery: "queue" }).catch(() => {})
        }
      }
    })

    // Advise during compaction summaries and optionally set custom result
    await ctx.session.hook("compaction", (event) => {
      const e = event as { system?: { type: string; text: string }[]; messages?: unknown; result?: { summary: string } }
      if (!Array.isArray(e.system)) return
      if (e.system.some((b) => b.type === "text" && b.text.startsWith(MARKER))) return

      const chars = serializedLength(e.messages)
      const tokens = Math.round(chars / 4)
      e.system.push({
        type: "text",
        text: `${MARKER}compaction triggered (~${tokens} tokens). Preserve key decisions and file paths.`,
      })

      // If manual mode and summaryBuffer enabled, set a custom summary to skip model call
      if (config.compression.mode === "manual" && config.compression.summaryBuffer) {
        const recentMessages = Array.isArray(e.messages) ? e.messages.slice(-5) : []
        const summary = config.compression.summaryTemplate + "\n\nRecent context preserved:\n" +
          recentMessages.map((m: any) => `- ${typeof m === "string" ? m : JSON.stringify(m).slice(0, 200)}`).join("\n")
        e.result = { summary }
      }
    })

    return () => {}
  },
})