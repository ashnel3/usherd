import { Command } from 'commander'
import { expect } from 'vitest'

import type { IActionContext } from '$bin/context'

/** action context fixture */
export const ActionContext: IActionContext<unknown> = expect.objectContaining({
  config: expect.anything(),
  opts: expect.anything(),
  program: expect.any(Command),
  database: expect.any(Function),
  path: {
    profile: expect.any(String),
  },
})

export default ActionContext
