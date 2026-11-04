import { describe, expect, it } from 'vitest'
import { appInfoSchema } from '../../src/shared/app-info'
import { islandExpandedSchema } from '../../src/shared/island-state'

describe('Shared Schemas', () => {
  describe('appInfoSchema', () => {
    it('accepts valid application information', () => {
      const validWinPayload = {
        name: 'NEXUS ISLAND',
        version: '0.1.0',
        platform: 'win32' as const
      }
      expect(appInfoSchema.parse(validWinPayload)).toEqual(validWinPayload)

      const validMacPayload = {
        name: 'NEXUS ISLAND',
        version: '1.2.3',
        platform: 'darwin' as const
      }
      expect(appInfoSchema.parse(validMacPayload)).toEqual(validMacPayload)

      const validLinuxPayload = {
        name: 'NEXUS ISLAND',
        version: '0.0.1',
        platform: 'linux' as const
      }
      expect(appInfoSchema.parse(validLinuxPayload)).toEqual(validLinuxPayload)
    })

    it('rejects invalid application name', () => {
      const invalidNumberName = {
        name: 12345,
        version: '0.1.0',
        platform: 'win32'
      }
      expect(() => appInfoSchema.parse(invalidNumberName)).toThrow()

      const invalidNullName = {
        name: null,
        version: '0.1.0',
        platform: 'win32'
      }
      expect(() => appInfoSchema.parse(invalidNullName)).toThrow()
    })

    it('rejects invalid platform', () => {
      const invalidPlatform = {
        name: 'NEXUS ISLAND',
        version: '0.1.0',
        platform: 'android'
      }
      expect(() => appInfoSchema.parse(invalidPlatform)).toThrow()

      const unknownPlatform = {
        name: 'NEXUS ISLAND',
        version: '0.1.0',
        platform: 'aix'
      }
      expect(() => appInfoSchema.parse(unknownPlatform)).toThrow()
    })

    it('rejects missing fields', () => {
      expect(() => appInfoSchema.parse({})).toThrow()

      expect(() =>
        appInfoSchema.parse({
          version: '0.1.0',
          platform: 'win32'
        })
      ).toThrow()

      expect(() =>
        appInfoSchema.parse({
          name: 'NEXUS ISLAND',
          platform: 'win32'
        })
      ).toThrow()

      expect(() =>
        appInfoSchema.parse({
          name: 'NEXUS ISLAND',
          version: '0.1.0'
        })
      ).toThrow()
    })
  })

  describe('islandExpandedSchema', () => {
    it('accepts true', () => {
      expect(islandExpandedSchema.parse(true)).toBe(true)
    })

    it('accepts false', () => {
      expect(islandExpandedSchema.parse(false)).toBe(false)
    })

    it('rejects strings', () => {
      expect(() => islandExpandedSchema.parse('true')).toThrow()
      expect(() => islandExpandedSchema.parse('false')).toThrow()
      expect(() => islandExpandedSchema.parse('')).toThrow()
    })

    it('rejects numbers', () => {
      expect(() => islandExpandedSchema.parse(1)).toThrow()
      expect(() => islandExpandedSchema.parse(0)).toThrow()
      expect(() => islandExpandedSchema.parse(-1)).toThrow()
      expect(() => islandExpandedSchema.parse(NaN)).toThrow()
    })

    it('rejects null and undefined', () => {
      expect(() => islandExpandedSchema.parse(null)).toThrow()
      expect(() => islandExpandedSchema.parse(undefined)).toThrow()
    })
  })
})
