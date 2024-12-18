import { pathToFileURL } from 'node:url'
import type { Page } from 'puppeteer-core'

export type UsherTaskFn = (ctx: ITaskContext) => Promise<unknown>

export interface ITaskContext {
  readonly page: Page
}

export interface ITaskModule {
  readonly url?: URL | string

  readonly after?: (result: unknown) => Promise<void>
  readonly afterAll?: (result: unknown) => Promise<void>
  readonly before?: () => Promise<void>
  readonly beforeAll?: () => Promise<void>

  readonly default: UsherTaskFn
}

export class UsherTask {
  readonly name: string
  module?: ITaskModule
  path?: string

  constructor(name: string) {
    this.name = name
  }

  /**
   * load task module
   * @param path - module path
   * @returns      this
   */
  async load(path: string): Promise<this> {
    this.path = path
    this.module = await import(pathToFileURL(path).toString())
    return this
  }

  /**
   * run task module
   * @param ctx - task context
   * @returns     task result value
   */
  async run(ctx: ITaskContext) {
    if (!this.module) {
      return
    }
    return await this.module.default(ctx)
  }
}

export default UsherTask
