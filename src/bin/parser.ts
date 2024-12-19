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
