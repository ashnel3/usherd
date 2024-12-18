import { Command } from 'commander'
import context, { type IActionContext } from './context'
import path from 'node:path'

/**
 * usher command module exports
 * @private
 */
interface ICommandModule {
  action: () => Promise<void>
  default: (command: Command) => Command
}

/** usher global command-line options */
export interface IGlobalOptions {
  debug: boolean
  profile: string
}

/** usher command modules */
export const commands = Object.entries(
  import.meta.glob<boolean, string, ICommandModule>('./command/*'),
)

/** usher commander program */
export const program: Command = new Command(USHERD.NAME)
  .option('-d, --debug', 'show debug information', false)
  .option('-p, --profile <PATH>', 'browser profile directory', path.resolve('./profile'))
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
    return action(await context(program, args.pop(), args.pop()), ...args)
  }

/**
 * register cli commands
 * @param extend - extra command modules
 * @returns        commander program
 */
export const register = async (extend: typeof commands = []): Promise<Command> => {
  await Promise.all(
    commands.concat(extend).map(async ([path, mod]) => {
      await mod()
        .then(({ action, default: register }) => {
          return register(program).action(ActionWrapper(action))
        })
        .catch((error) => {
          console.error(`UNREACHABLE: failed to load command module "${path}"!`)
          throw error
        })
    }),
  )
  return program
}

export default program
