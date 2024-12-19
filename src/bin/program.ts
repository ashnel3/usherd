import { Command } from 'commander'
import context, { type IActionContext } from './context'
import path from 'node:path'

/**
 * usher command module exports
 * @private
 */
export interface ICommandModule {
  action: (...args: any) => Promise<any>
  default: (command: Command) => Command
}

/** usher global command-line options */
export interface IGlobalOptions {
  debug?: boolean
  profile: string
}

/** usher command modules */
export const commands = Object.values(
  import.meta.glob<true, string, ICommandModule>('./command/*', { eager: true }),
)

/** usher commander program */
export const program: Command = new Command(USHERD.NAME)
  .option('--debug', 'show debug information', false)
  .option('-p, --profile <PATH>', 'browser profile directory', path.resolve(USHERD.PATH.PROFILE))
  .description(USHERD.DESCRIPTION)
  .version(`${USHERD.NAME} v${USHERD.VERSION}`, '-v, --version')

/**
 * create action wrapper
 * @private
 * @param action - action callback
 * @returns      - action wrapper fn
 */
const ActionWrapper =
  (action: (ctx: IActionContext<any>, ...args: any) => Promise<void>) =>
  async (...args: any[]) => {
    const ctx = await context(program, args.pop(), args.pop())
    try {
      return await action(ctx, ...args)
    } finally {
      await ctx.destroy()
    }
  }

/**
 * register cli commands
 * @param extend - extra command modules
 * @param base   - base commands
 * @returns        commander program
 */
export const register = (extend?: ICommandModule[], base = commands): Command => {
  base.concat(extend ?? []).forEach(({ action, default: registerCommand }) => {
    // TODO: expect registerCommand to create command chain
    registerCommand(program).action(ActionWrapper(action))
  })
  return program
}

export default program
