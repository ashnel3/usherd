export interface IAssertionErrorOptions extends ErrorOptions {
  readonly type: string
}

export class AssertionError extends Error {
  constructor(msg?: string, options?: IAssertionErrorOptions) {
    super(msg, options)
  }
}

export const truthy = <T>(value: T, msg?: string): NonNullable<T> => {
  if (!value) {
    throw new AssertionError(msg, { type: 'truthy' })
  }
  return value
}

export default truthy
