// https://vitest.dev/config/#globalsetup

import { PATH_PROFILE } from "./const"
import { rmrf } from './util/fs'

export const PATHS_TEMP = [PATH_PROFILE]

export const clean = async () => await rmrf(PATHS_TEMP)

export const teardown = async () => {
  await clean()
}

export const setup = async () => {
  await clean()
}
