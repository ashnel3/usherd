import assert from './util/assert'
import read from './config'

import type { IUsherConfig } from './config'
import type { Command, OptionValues } from 'commander'
import type { IGlobalOptions } from './program'

/** command action context */
export interface IActionContext<T> {
  readonly command: Command
  readonly config: IUsherConfig
  readonly database: any
  readonly path: {
    profile: string
  }
  readonly opts: T & IGlobalOptions
}

/**
 * create action context
 * @private
 * @param program - commander program
 * @param command - commander sub command
 * @param opts    - commander options
 * @returns       - action context
 */
export const context = async (
  program: Command,
  command?: Command,
  opts: OptionValues = {},
): Promise<IActionContext<any>> => {
  const globals = program.opts<IGlobalOptions>()
  const [config] = await Promise.all([read(globals.profile)])
  return {
    command: assert(command, 'unreachable: expected action command!'),
    config,
    database: undefined,
    path: {
      profile: globals.profile,
    },
    // merge local & global options
    opts: Object.assign(globals, opts),
  }
}

export type { Command, OptionValues } from 'commander'

export default context
