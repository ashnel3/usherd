import { rm } from "node:fs/promises"

export const rmrf = async (paths: string[]) => {
  await Promise.all(
    paths.map(async (p) => await rm(p, { force: true, recursive: true }))
  )
}

export * from 'node:fs/promises'

export default rmrf
