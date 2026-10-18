import { createInterface } from 'node:readline/promises'

export type Prompt = {
  ask(question: string, fallback?: string): Promise<string>
  choose<T extends string>(question: string, options: readonly T[]): Promise<T>
  close(): void
}

export function terminalPrompt(): Prompt {
  const rl = createInterface({ input: process.stdin, output: process.stdout })

  const ask = async (question: string, fallback?: string) => {
    const suffix = fallback ? ` (${fallback})` : ''
    const answer = (await rl.question(`${question}${suffix}: `)).trim()
    return answer || fallback || ''
  }

  const choose = async <T extends string>(question: string, options: readonly T[]): Promise<T> => {
    process.stdout.write(`${question}\n`)
    options.forEach((option, i) => process.stdout.write(`  ${i + 1}) ${option}\n`))
    for (;;) {
      const answer = await ask('Choose')
      const picked = options[Number(answer) - 1] ?? options.find((o) => o === answer)
      if (picked) return picked
      process.stdout.write(`Pick 1-${options.length}.\n`)
    }
  }

  return { ask, choose, close: () => rl.close() }
}
