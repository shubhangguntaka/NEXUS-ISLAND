import { z } from 'zod'

export const islandExpandedSchema = z.boolean()

export type IslandExpanded = z.infer<typeof islandExpandedSchema>
