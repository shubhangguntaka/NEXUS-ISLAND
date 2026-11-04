import { registerAppHandlers } from './app-handlers'
import { registerIslandHandlers } from './island-handlers'

export function registerIpcHandlers(): void {
  registerAppHandlers()
  registerIslandHandlers()
}
