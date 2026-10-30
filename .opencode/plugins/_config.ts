// Shared configuration loader for HELIX OpenCode plugins.
// Reads JSON/JSONC config files from .opencode/ directory with global/project/config-dir overrides.
// Usage: const config = loadConfig("essentials", DEFAULT_CONFIG, ctx)

import { readFileSync, existsSync, statSync } from "node:fs"
import { join, dirname } from "node:path"
import { homedir } from "node:os"

const GLOBAL_CONFIG_DIR = process.env.XDG_CONFIG_HOME
  ? join(process.env.XDG_CONFIG_HOME, "opencode")
  : join(homedir(), ".config", "opencode")

const CONFIG_DIR_ENV = process.env.OPENCODE_CONFIG_DIR

function findOpencodeDir(startDir: string): string | null {
  let current = startDir
  while (current !== "/" && current !== "\\") {
    const candidate = join(current, ".opencode")
    try {
      if (existsSync(candidate) && statSync(candidate).isDirectory()) return candidate
    } catch {
      // ignore
    }
    const parent = dirname(current)
    if (parent === current) break
    current = parent
  }
  return null
}

function getConfigPaths(pluginName: string, ctx?: { directory?: string }): { global: string | null; configDir: string | null; project: string | null } {
  const globalJsonc = join(GLOBAL_CONFIG_DIR, `${pluginName}.jsonc`)
  const globalJson = join(GLOBAL_CONFIG_DIR, `${pluginName}.json`)
  const global = existsSync(globalJsonc) ? globalJsonc : existsSync(globalJson) ? globalJson : null

  let configDir: string | null = null
  if (CONFIG_DIR_ENV) {
    const jsonc = join(CONFIG_DIR_ENV, `${pluginName}.jsonc`)
    const json = join(CONFIG_DIR_ENV, `${pluginName}.json`)
    configDir = existsSync(jsonc) ? jsonc : existsSync(json) ? json : null
  }

  let project: string | null = null
  if (ctx?.directory) {
    const opencodeDir = findOpencodeDir(ctx.directory)
    if (opencodeDir) {
      const projectJsonc = join(opencodeDir, `${pluginName}.jsonc`)
      const projectJson = join(opencodeDir, `${pluginName}.json`)
      project = existsSync(projectJsonc) ? projectJsonc : existsSync(projectJson) ? projectJson : null
    }
  }

  return { global, configDir, project }
}

function loadJsonFile(path: string | null): Record<string, unknown> | null {
  if (!path) return null
  try {
    const content = readFileSync(path, "utf-8")
    // Simple JSONC: strip // comments and /* */ comments
    const stripped = content
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
    return JSON.parse(stripped)
  } catch {
    return null
  }
}

function deepMerge<T extends Record<string, any>>(base: T, override: Record<string, any> | null): T {
  if (!override) return base
  const result: Record<string, any> = { ...base }
  for (const key of Object.keys(override)) {
    const overrideVal = override[key]
    const baseVal = result[key]
    if (overrideVal && typeof overrideVal === "object" && !Array.isArray(overrideVal) &&
        baseVal && typeof baseVal === "object" && !Array.isArray(baseVal)) {
      result[key] = deepMerge(baseVal, overrideVal)
    } else if (overrideVal !== undefined) {
      result[key] = overrideVal
    }
  }
  return result as T
}

export function loadConfig<T extends Record<string, any>>(
  pluginName: string,
  defaults: T,
  ctx?: { directory?: string; options?: Record<string, unknown> },
): T {
  const paths = getConfigPaths(pluginName, ctx)
  let config: T = { ...defaults }

  // Apply in priority order: global -> configDir -> project -> plugin options
  const globalData = loadJsonFile(paths.global)
  if (globalData) config = deepMerge(config, globalData)

  const configDirData = loadJsonFile(paths.configDir)
  if (configDirData) config = deepMerge(config, configDirData)

  const projectData = loadJsonFile(paths.project)
  if (projectData) config = deepMerge(config, projectData)

  // Plugin options from opencode.jsonc take highest priority
  if (ctx?.options && typeof ctx.options === "object") {
    config = deepMerge(config, ctx.options as Record<string, any>)
  }

  return config
}

export function resolveLimit(value: number | string, total: number): number {
  if (typeof value === "number") return value
  if (typeof value === "string" && value.endsWith("%")) {
    const pct = parseFloat(value)
    return Math.round((pct / 100) * total)
  }
  return total
}