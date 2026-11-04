import { BrowserWindow, ipcMain } from 'electron'
import { islandExpandedSchema } from '../../shared/island-state'
import { getIslandWindow, resizeIsland } from '../windows/island-window'

export function registerIslandHandlers(): void {
  ipcMain.handle('nexus:island:set-expanded', (event, value: unknown) => {
    const expanded = islandExpandedSchema.parse(value)

    const islandWindow = getIslandWindow()
    const senderWindow = BrowserWindow.fromWebContents(event.sender)

    if (!islandWindow || senderWindow !== islandWindow) {
      throw new Error('Unauthorized island window request')
    }

    resizeIsland(expanded)
  })
}
