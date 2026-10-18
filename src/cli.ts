#!/usr/bin/env node
import { runInit } from './commands/init.js'
import { terminalPrompt } from './core/prompt.js'

const [, , command, ...rest] = process.argv

const commands: Record<string, (args: string[]) => Promise<number>> = {
  init: async (args) => {
    const prompt = terminalPrompt()
    try {
      return await runInit(args, process.cwd(), prompt)
    } finally {
      prompt.close()
    }
  },
}

const run = command ? commands[command] : undefined

if (!run) {
  process.stderr.write('usage: dcke init [--type android|kmp|ios|springboot] [--name <Name>] [--package <com.example.app>]\n')
  process.exit(command === '--help' || command === '-h' ? 0 : 2)
}

process.exit(await run(rest))
