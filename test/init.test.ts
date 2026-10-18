import { existsSync, mkdtempSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { runInit } from '../src/commands/init.js'
import { detectProject } from '../src/core/project.js'
import type { Prompt } from '../src/core/prompt.js'

const scripted = (answers: string[]): Prompt => ({
  ask: async (_q, fallback) => answers.shift() || fallback || '',
  choose: async (_q, options) => options.find((o) => o === answers.shift()) ?? options[0]!,
  close: () => {},
})

let dir: string
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'dcke-'))
  vi.spyOn(process.stdout, 'write').mockReturnValue(true)
  vi.spyOn(process.stderr, 'write').mockReturnValue(true)
})

describe('detectProject', () => {
  it('returns undefined for an empty directory', () => {
    expect(detectProject(dir)).toBeUndefined()
  })

  it.each([
    ['settings.gradle.kts', 'rootProject.name = "x"', 'android'],
    ['build.gradle.kts', 'kotlin("multiplatform")', 'kmp'],
    ['pom.xml', '<artifactId>spring-boot-starter</artifactId>', 'springboot'],
    ['Package.swift', '', 'ios'],
  ])('detects %s as %s', (file, content, type) => {
    writeFileSync(join(dir, file), content)
    expect(detectProject(dir)).toBe(type)
  })
})

describe('dcke init', () => {
  it('scaffolds an android project from prompted answers', async () => {
    const code = await runInit([], dir, scripted(['android', 'Todo', 'com.acme.todo']))

    expect(code).toBe(0)
    const root = join(dir, 'Todo')
    expect(readFileSync(join(root, 'settings.gradle.kts'), 'utf8')).toContain('rootProject.name = "Todo"')
    expect(readFileSync(join(root, 'app/build.gradle.kts'), 'utf8')).toContain('namespace = "com.acme.todo"')
    expect(existsSync(join(root, 'app/src/main/kotlin/com/acme/todo/MainActivity.kt'))).toBe(true)
    expect(existsSync(join(root, 'gradle/wrapper/gradle-wrapper.jar'))).toBe(true)
    expect(statSync(join(root, 'gradlew')).mode & 0o111).not.toBe(0)
    expect(JSON.parse(readFileSync(join(root, '.dcke/config.json'), 'utf8'))).toEqual({ type: 'android' })
  })

  it('initializes an existing project in place without prompting', async () => {
    writeFileSync(join(dir, 'settings.gradle.kts'), '')

    expect(await runInit([], dir, scripted([]))).toBe(0)
    expect(JSON.parse(readFileSync(join(dir, '.dcke/config.json'), 'utf8'))).toEqual({ type: 'android' })
    expect(await runInit([], dir, scripted([]))).toBe(1)
  })

  it.each(['kmp', 'ios', 'springboot'])('refuses %s until it is supported', async (type) => {
    expect(await runInit(['--type', type], dir, scripted([]))).toBe(1)
  })

  it('rejects an invalid package name', async () => {
    expect(await runInit(['--type', 'android', '--name', 'Todo', '--package', 'Todo'], dir, scripted([]))).toBe(1)
    expect(existsSync(join(dir, 'Todo'))).toBe(false)
  })

  it('refuses to scaffold into a non-empty directory', async () => {
    await runInit(['--type', 'android', '--name', 'Todo', '--package', 'com.acme.todo'], dir, scripted([]))
    expect(await runInit(['--type', 'android', '--name', 'Todo', '--package', 'com.acme.todo'], dir, scripted([]))).toBe(1)
  })
})
