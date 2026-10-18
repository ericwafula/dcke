import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { PROJECT_TYPES, type ProjectType, detectProject, isProjectType } from '../core/project.js'
import type { Prompt } from '../core/prompt.js'
import { copyStatic, writeConfig, writeFiles } from '../core/scaffold.js'
import { ANDROID_STATIC_FILES, androidFiles } from '../templates/android.js'

const PACKAGE_NAME = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/
const PROJECT_NAME = /^[A-Za-z][A-Za-z0-9_-]*$/

type Flags = { type?: string; name?: string; package?: string }

function parseFlags(args: string[]): Flags {
  const flags: Flags = {}
  for (let i = 0; i < args.length; i++) {
    const key = args[i]?.replace(/^--/, '')
    if (key === 'type' || key === 'name' || key === 'package') flags[key] = args[++i]
  }
  return flags
}

const say = (line: string) => process.stdout.write(`${line}\n`)
const fail = (line: string) => {
  process.stderr.write(`dcke init: ${line}\n`)
  return 1
}

export async function runInit(args: string[], cwd: string, prompt: Prompt): Promise<number> {
  const flags = parseFlags(args)

  const existing = detectProject(cwd)
  if (existing) {
    if (existsSync(join(cwd, '.dcke/config.json'))) return fail('this project is already initialized')
    writeConfig(cwd, existing)
    say(`Initialized dcke in this ${existing} project.`)
    return 0
  }

  if (flags.type && !isProjectType(flags.type)) return fail(`unknown type "${flags.type}" (expected ${PROJECT_TYPES.join(', ')})`)
  const type: ProjectType = (flags.type as ProjectType | undefined) ?? (await prompt.choose('What type of project?', PROJECT_TYPES))
  if (type !== 'android') return fail(`${type} projects are not supported yet`)

  const name = flags.name ?? (await prompt.ask('Project name', 'MyApp'))
  if (!PROJECT_NAME.test(name)) return fail(`"${name}" is not a valid project name`)

  const packageName = flags.package ?? (await prompt.ask('Package name', `com.example.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`))
  if (!PACKAGE_NAME.test(packageName)) return fail(`"${packageName}" is not a valid package name`)

  const root = join(cwd, name)
  if (existsSync(root) && readdirSync(root).length > 0) return fail(`${name}/ already exists and is not empty`)

  writeFiles(root, androidFiles({ name, packageName }))
  copyStatic(root, 'android', ANDROID_STATIC_FILES)
  writeConfig(root, type)

  say(`Created ${name}/ (android, ${packageName}).`)
  say(`Next: cd ${name} && ./gradlew assembleDebug`)
  return 0
}
