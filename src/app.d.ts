/// <reference types="vite/client" />
/// <reference types="vitest" />

export interface IUsherMetadata {
  readonly DESCRIPTION: string
  readonly ISSUES: string
  readonly HOMEPAGE: string
  readonly NAME: string
  readonly VERSION: string
  readonly PATH: {
    PROFILE: string
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
