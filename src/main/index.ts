import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { appInfoSchema } from '../shared/app-info'
import { islandExpandedSchema } from '../shared/island-state'
import icon from '../../resources/icon.png?asset'

app.setName('NEXUS ISLAND')

const APP_ID = 'com.shubhang.nexusisland'

const ISLAND = {
  compact: {
    width: 220,
    height: 64
  },
  expanded: {
    width: 460,
    height: 220
  },
  topOffset: 12
} as const

let islandWindow: BrowserWindow | null = null

function positionIsland(width: number, height: number): void {
  if (!islandWindow || islandWindow.isDestroyed()) return

  const display = screen.getPrimaryDisplay()
  const { x, y, width: workAreaWidth } = display.workArea

  const left = Math.round(x + (workAreaWidth - width) / 2)
  const top = y + ISLAND.topOffset

  islandWindow.setBounds({
    x: left,
    y: top,
    width,
    height
  })
}

function resizeIsland(expanded: boolean): void {
  if (!islandWindow || islandWindow.isDestroyed()) return

  const dimensions = expanded ? ISLAND.expanded : ISLAND.compact

  positionIsland(dimensions.width, dimensions.height)
}

function registerIpcHandlers(): void {
  ipcMain.handle('nexus:app:get-info', () => {
    const info = {
      name: app.getName(),
      version: app.getVersion(),
      platform: process.platform
    }

    return appInfoSchema.parse(info)
  })

  ipcMain.handle('nexus:island:set-expanded', (event, value: unknown) => {
    const expanded = islandExpandedSchema.parse(value)

    const senderWindow = BrowserWindow.fromWebContents(event.sender)

    if (!islandWindow || senderWindow !== islandWindow) {
      throw new Error('Unauthorized island window request')
    }

    resizeIsland(expanded)
  })
}

function createIslandWindow(): void {
  const { width, height } = ISLAND.compact

  islandWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,

    title: 'NEXUS ISLAND',

    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,

    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,

    alwaysOnTop: true,
    skipTaskbar: false,
    autoHideMenuBar: true,

    ...(process.platform === 'linux' ? { icon } : {}),

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  })

  positionIsland(width, height)

  islandWindow.once('ready-to-show', () => {
    islandWindow?.show()
  })

  islandWindow.webContents.setWindowOpenHandler(({ url }) => {
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
    void islandWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    void islandWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  islandWindow.on('closed', () => {
    islandWindow = null
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId(APP_ID)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  createIslandWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createIslandWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
