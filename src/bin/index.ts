import { register } from './program'

/**
 * program entrypoint
 * @param args - command-line arguments
 * @returns      commander program
 */
export const main = async (args?: string[]) => {
  return (await register()).parse(args)
}

// main

void (async () => {
  // TODO: check if main
  await main()
})()

// exports

export * from './config'
export * from './context'
export * from './program'
export * as parser from './parser'

export default main
