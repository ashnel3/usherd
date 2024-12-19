import { PATH_PROFILE } from '$test/const'

import { ActionContext } from '$test/fixture/match'
import { register } from '$bin/program'
import { describe, expect, it, vi } from 'vitest'

describe('program', () => {
  it('should register extended commands', async () => {
    const name = 'testing'
    const description = 'testing description'
    const spy = vi.fn(async () => {})
    // register commands
    const program = register(
      [
        {
          action: spy,
          default: (program) => {
            return program
              .command(name, { isDefault: true })
              .argument('[VALUES...]')
              .description(description)
          },
        },
      ],
      [],
    )
    // parse args
    await program.parseAsync(['-p', PATH_PROFILE, 'hello', 'world'], { from: 'user' })
    // should be registered
    expect(program.commands).toHaveLength(1)
    expect(program.commands[0].name()).toBe(name)
    expect(program.commands[0].description()).toBe(description)
    // should call action w/ context
    expect(spy).toHaveBeenCalledWith(ActionContext, ['hello', 'world'])
  })
})
