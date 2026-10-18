import { chmodSync, copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ProjectType } from './project.js'

// templates/ sits next to dist/ (and src/), two levels above this file.
export const TEMPLATES_DIR = fileURLToPath(new URL('../../templates', import.meta.url))

export function writeFiles(root: string, files: Record<string, string>) {
  for (const [path, content] of Object.entries(files)) {
    const target = join(root, path)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, content)
  }
}

export function copyStatic(root: string, template: string, paths: string[]) {
  for (const path of paths) {
    const target = join(root, path)
    mkdirSync(dirname(target), { recursive: true })
    copyFileSync(join(TEMPLATES_DIR, template, path), target)
  }
  // copyFileSync keeps the mode on macOS but not everywhere; gradlew must stay executable.
  if (paths.includes('gradlew')) chmodSync(join(root, 'gradlew'), 0o755)
}

export function writeConfig(root: string, type: ProjectType) {
  writeFiles(root, { '.dcke/config.json': `${JSON.stringify({ type }, null, 2)}\n` })
}
