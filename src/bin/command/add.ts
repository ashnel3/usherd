import * as parser from '../parser'

import type { IActionContext, Command } from '$bin/context'

export interface IAddOptions {
  disable: boolean
  timeout: number
}

export const action = async (ctx: IActionContext<IAddOptions>, name: string, path: string) => {
  console.log({ ctx, name, path })
}

export default (program: Command) => {
  return program
    .command('add')
    .argument('<PATH>', 'task script / module path')
    .argument('<NAME>', 'task name')
    .option('-d, --disable', 'disable running', false)
    .option('-t, --timeout <TIME>', 'task timeout', parser.time(), 15e3)
}
