import { app, ipcMain } from 'electron'
import { appInfoSchema } from '../../shared/app-info'

export function registerAppHandlers(): void {
  ipcMain.handle('nexus:app:get-info', () => {
    const info = {
      name: app.getName(),
      version: app.getVersion(),
      platform: process.platform
    }

    return appInfoSchema.parse(info)
  })
}
