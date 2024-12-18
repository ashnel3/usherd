import fs from 'node:fs/promises'
import path from 'node:path'

/** usher configuration */
export interface IUsherConfig {
  browser: {
    path?: string
    type: 'chrome' | 'firefox'
  }
}

/** usher default configuration */
export const DEFAULTS: IUsherConfig = {
  browser: {
    type: 'chrome',
  },
}

/**
 * read & parse config
 * @param profile - profile directory
 * @returns       - config
 */
export const readConfig = async (profile: string): Promise<IUsherConfig> => {
  const filepath = path.join(profile, USHERD.PATH.CONFIG)
  try {
    return JSON.parse((await fs.readFile(filepath)).toString())
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
      console.log(`generating config "${filepath}"!`)
      // write defaults
      return await writeConfig(profile, DEFAULTS)
    }
    throw error
  }
}

/**
 * create directories & write config
 * @param profile - profile directory
 * @param data    - config data
 * @returns       - config data
 */
export const writeConfig = async (profile: string, data: IUsherConfig): Promise<IUsherConfig> => {
  const filepath = path.join(profile, USHERD.PATH.CONFIG)
  await fs.mkdir(path.dirname(filepath), { recursive: true })
  await fs.writeFile(filepath, JSON.stringify(data))
  return data
}

export default readConfig
