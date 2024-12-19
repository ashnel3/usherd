import { CommanderError } from 'commander'
import * as parser from '$bin/parser'
import { describe, expect, it } from 'vitest'

describe('parser', () => {
  describe('int', () => {
    const fn = parser.int()

    it('should parse integer', () => {
      expect(fn('12')).toBe(12)
    })

    it('should throw invalid', () => {
      expect(() => fn('hello')).toThrowError(CommanderError)
    })

    it('should throw out of range', () => {
      expect(() => fn('-12')).toThrowError(CommanderError)
    })
  })
})
