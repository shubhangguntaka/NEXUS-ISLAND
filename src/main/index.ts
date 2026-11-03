import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { appInfoSchema } from '../shared/app-info'
import icon from '../../resources/icon.png?asset'

app.setName('NEXUS ISLAND')

const APP_ID = 'com.shubhang.nexusisland'

function registerIpcHandlers(): void {
  ipcMain.handle('nexus:app:get-info', () => {
    const info = {
      name: app.getName(),
      version: app.getVersion(),
      platform: process.platform
    }

    return appInfoSchema.parse(info)
  })
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 650,
    minWidth: 360,
    minHeight: 300,
    show: false,
    frame: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),

      // Electron security
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsedUrl = new URL(url)

      if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
        void shell.openExternal(parsedUrl.toString())
      }
    } catch {
      // Reject malformed URLs.
    }

    return { action: 'deny' }
  })

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    void mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId(APP_ID)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
