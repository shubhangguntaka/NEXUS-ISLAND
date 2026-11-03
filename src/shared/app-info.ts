import { z } from 'zod'

export const appInfoSchema = z.object({
  name: z.string(),
  version: z.string(),
  platform: z.enum(['win32', 'darwin', 'linux'])
})

export type AppInfo = z.infer<typeof appInfoSchema>
