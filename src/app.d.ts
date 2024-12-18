/// <reference types="vitest" />
/// <reference types="vite/client" />

export interface IUsherMetadata {
  readonly DESCRIPTION: string
  readonly ISSUES: string
  readonly HOMEPAGE: string
  readonly NAME: string
  readonly VERSION: string
  readonly PATH: {
    CONFIG: string
    DATABASE: string
  }
}

export interface IUsherEnvironment {
  readonly USHERD: IUsherMetadata
}

declare global {
  const USHERD: IUsherMetadata
}
