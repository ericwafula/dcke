import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export const PROJECT_TYPES = ['android', 'kmp', 'ios', 'springboot'] as const
export type ProjectType = (typeof PROJECT_TYPES)[number]

export function isProjectType(value: string): value is ProjectType {
  return (PROJECT_TYPES as readonly string[]).includes(value)
}

const read = (path: string) => (existsSync(path) ? readFileSync(path, 'utf8') : '')

// Returns the type of the project rooted at `dir`, or undefined when `dir` is not a project.
export function detectProject(dir: string): ProjectType | undefined {
  const entries = existsSync(dir) ? readdirSync(dir) : []

  if (entries.some((e) => e.endsWith('.xcodeproj') || e.endsWith('.xcworkspace')) || entries.includes('Package.swift')) {
    return 'ios'
  }

  const pom = read(join(dir, 'pom.xml'))
  const gradle = read(join(dir, 'build.gradle.kts')) + read(join(dir, 'build.gradle'))
  if (pom.includes('spring-boot') || gradle.includes('org.springframework.boot')) return 'springboot'

  const gradleFiles = ['build.gradle.kts', 'build.gradle', 'settings.gradle.kts', 'settings.gradle']
  if (!gradleFiles.some((f) => entries.includes(f))) return undefined
  if (gradle.includes('multiplatform') || entries.includes('composeApp') || entries.includes('shared')) return 'kmp'
  return 'android'
}
