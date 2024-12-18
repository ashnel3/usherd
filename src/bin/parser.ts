import { CommanderError } from 'commander'

/**
 * parse int argument
 * @param min - min value
 * @param max - max value
 * @returns     parser fn
 */
export const int =
  (min = 0, max = Infinity) =>
  (value: string): number => {
    const int = parseInt(value, 10)
    if (isNaN(int) || int < min || int > max) {
      throw new CommanderError(1, '1', `invalid integer "${value}"!`)
    }
    return int
  }

/**
 * parse time argument
 * @param min - min value
 * @param max - max value
 * @returns     parser fn
 */
export const time = (min = 0, max = Infinity) => {
  const units = {
    ms: 1,
    s: 1000,
    h: 3.6e6,
    d: 8.64e7,
    m: 2.628e9,
    y: 3.171e11,
  }
  return (value: string): number => 0
}
