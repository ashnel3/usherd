import type { Knex } from 'knex'

export class ViteSeedSource implements Knex.SeedSource<string> {
  readonly modules = import.meta.glob<false, string, Knex.Seed>('./seed/*')

  async getSeed(filepath: string): Promise<Knex.Seed> {
    return await this.modules[filepath]()
  }

  async getSeeds(config: Knex.SeederConfig) {
    return Object.keys(this.modules)
  }
}
