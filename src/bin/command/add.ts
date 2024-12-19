import * as parser from '../parser'

import type { IActionContext, Command } from '$bin/context'
import type { QueryError } from '$lib/database'

export interface IAddOptions {
  disable: boolean
  interval: number
}

export const action = async (
  { database, opts, program }: IActionContext<IAddOptions>,
  path: string,
  name: string,
) => {
  try {
    const [task] = await database('task')
      .insert({
        interval: opts.interval,
        enabled: !opts.disable,
        name,
        path,
      })
      .returning('*')
    console.log(`Added task "${task.name}"!`)
  } catch (error) {
    switch ((error as QueryError).errno) {
      case 19:
        return program.error(`ERROR: task "${name}" already exists!`)
      default:
        throw error
    }
  }
}

export default (program: Command) => {
  return program
    .command('add')
    .argument('<PATH>', 'task script / module path')
    .argument('<NAME>', 'task name')
    .option('-d, --disable', 'disable running', false)
    .option('-i, --interval <TIME>', 'task timeout', parser.int(), 15e3)
}
