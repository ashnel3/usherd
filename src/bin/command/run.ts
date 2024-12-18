import { puppeteer } from '$lib'
import type { Command, IActionContext } from '$bin/context'

export interface IRemoveOptions {
  dry: boolean
}

export const action = async (
  { config, database, opts }: IActionContext<IRemoveOptions>,
  names: string[],
) => {
  const tasks = await database('task').select('*')
  const browser = await puppeteer.launch({
    channel: config.browser.channel || config.browser.type === 'chrome' ? 'chrome' : undefined,
    browser: config.browser.type ?? 'chrome',
    executablePath: config.browser.path,
    userDataDir: opts.profile,
  })
  console.log(tasks)
  return browser.close()
}

export default (program: Command) => {
  return program
    .command('run', { isDefault: true })
    .argument('[NAMES...]', 'task name(s)')
    .option('-d, --dry', 'ignore results', false)
}