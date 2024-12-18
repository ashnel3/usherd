import Database from '$lib/database'
import fs from 'node:fs/promises'
import path from 'node:path'

import type { Command, OptionValues } from 'commander'
import type { IGlobalOptions } from './program'
import type { Knex } from 'knex'

/** command action context */
export interface IActionContext<T> {
  readonly program: Command
  readonly command?: Command
  readonly config: IUsherConfig
  readonly database: Knex
  readonly opts: T & IGlobalOptions
}

/** usher configuration */
export interface IUsherConfig {
  browser: {
    channel?: string
    path?: string
    type: 'chrome' | 'firefox'
  }
}

/** usher default configuration */
export const DEFAULTS: IUsherConfig = {
  browser: {
    type: 'chrome',
  },
}

/**
 * read & parse config
 * @param filepath    - config path
 * @returns             config data
 */
export const readConfig = async (filepath: string): Promise<IUsherConfig> => {
  try {
    return JSON.parse((await fs.readFile(filepath)).toString())
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // write defaults
      return await writeConfig(filepath, DEFAULTS)
    }
    throw error
  }
}

/**
 * create directories & write config
 * @param filepath - config path
 * @param data     - config data
 * @returns          config data
 */
export const writeConfig = async (filepath: string, data: IUsherConfig): Promise<IUsherConfig> => {
  await fs.writeFile(filepath, JSON.stringify(data, null, 4))
  return data
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
  const [database, config] = await fs
    .mkdir(globals.profile, { recursive: true })
    .then(
      async () =>
        await Promise.all([
          Database(path.join(globals.profile, USHERD.PATH.DATABASE)),
          readConfig(path.join(globals.profile, USHERD.PATH.CONFIG)),
        ]),
    )
    .catch((error) => {
      console.error(`ERROR: failed to read profile "${globals.profile}"!\n`)
      throw error
    })
  return {
    command,
    config,
    database,
    program,
    // merge local & global options
    opts: Object.assign(globals, opts),
  }
}

export type { Command, OptionValues } from 'commander'

export default context
