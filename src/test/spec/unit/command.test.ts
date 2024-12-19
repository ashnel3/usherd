import { PATH_PROFILE } from '$test/const'
import { program } from 'commander'

import { context } from '$bin/context'
import { join } from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'

describe('command', async () => {
  const ctx = await context(program, undefined, undefined, PATH_PROFILE)

  afterAll(async () => await ctx.destroy())

  describe('add', () => {
    it('should create task', async () => {
      const { action } = await import('$bin/command/add')
      const name = '_testing_add'
      const path = join(import.meta.dirname, '../../fixture/data/task.js')
      // run action
      await action(
        { ...ctx, opts: { profile: PATH_PROFILE, interval: 0, disable: true } },
        path,
        name,
      )
      // expect task
      expect(ctx.database('task').where('name', name).first()).toBeTruthy()
    })
  })
})
