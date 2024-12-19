import connect from '$lib/database'
import fs from 'node:fs/promises'
import { join, resolve } from 'node:path'

import type { Command, OptionValues } from 'commander'
import type { IGlobalOptions } from './program'
import type { Knex } from 'knex'

/** command action context */
export interface IActionContext<T> extends IUsherProfile {
  readonly command?: Command
  readonly program: Command
  readonly opts: T & IGlobalOptions

  readonly destroy: () => Promise<void>
}

/** usher configuration type */
export type UsherConfig = Partial<IUsherConfig>

/** usher configuration interface */
export interface IUsherConfig {
  readonly browser: {
    arguments?: string[]
    headless?: boolean
    channel?: string
    executablePath?: string
    type: 'chrome' | 'firefox'
  }
}

/** usher browser profile configuration */
export interface IUsherProfile {
  readonly config: Partial<IUsherConfig>
  readonly database: Knex
  readonly path: {
    profile: string
  }
}

/** usher default configuration */
export const CONFIG: IUsherConfig = {
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
      return await writeConfig(filepath, CONFIG)
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
  await fs.writeFile(filepath, JSON.stringify(data, null, 2))
  return data
}

/**
 * load profile configuration
 * @param dir - profile dir path
 * @returns     config & database
 */
export const profile = async (dir: string): Promise<IUsherProfile> => {
  return await fs
    .mkdir(dir, { recursive: true })
    .then(async () => {
      const [database, config] = await Promise.all([
        connect(join(dir, USHERD.PATH.DATABASE)),
        readConfig(join(dir, USHERD.PATH.CONFIG)),
      ])
      return {
        database,
        config,
        path: {
          profile: dir,
        },
      }
    })
    .catch((error) => {
      console.error(`ERROR: failed to read profile "${dir}"!\n`)
      throw error
    })
}

/**
 * create action context
 * @private
 * @param program - commander program
 * @param command - commander sub command
 * @param opts    - commander options
 * @param dir     - profile directory override
 * @returns         action context
 */
export const context = async (
  program: Command,
  command?: Command,
  opts: OptionValues = {},
  dir?: string,
): Promise<IActionContext<any>> => {
  const globals = program.opts<IGlobalOptions>()
  const profilePath = resolve(dir ?? globals.profile)
  const { config, database, path } = await profile(profilePath)
  return {
    config,
    database,
    command,
    program,
    // context paths
    path,
    // merge local & global options
    opts: Object.assign(globals, opts),
    // destroy context
    destroy: async () => {
      await database.destroy()
    },
  }
}

export type { Command, OptionValues } from 'commander'

export default context
