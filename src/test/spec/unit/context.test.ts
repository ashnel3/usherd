import { PATH_PROFILE } from '$test/const'

import { ActionContext } from '$test/fixture/match'
import { program, context } from '$bin'
import { afterAll, describe, expect, it } from 'vitest'

describe('context', async () => {
  const ctx = await context(program, undefined, undefined, PATH_PROFILE)

  afterAll(async () => {
    await ctx.destroy()
  })

  it('should create context', async () => {
    expect(ctx).toMatchObject(ActionContext)
  })
})
