import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createIslandWindow, getIslandWindow } from './windows/island-window'
import { registerIpcHandlers } from './ipc/register'

export * from './windows/island-window'
export * from './ipc/register'

app.setName('NEXUS ISLAND')

const APP_ID = 'com.shubhang.nexusisland'

app.whenReady().then(() => {
  electronApp.setAppUserModelId(APP_ID)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  createIslandWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 || !getIslandWindow()) {
      createIslandWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
