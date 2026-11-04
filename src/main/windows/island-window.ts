import { BrowserWindow, screen, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.png?asset'

export const ISLAND = {
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
let isExpanded = false
let displayListenersAttached = false

export function calculateIslandBounds(
  width: number,
  height: number
): { x: number; y: number; width: number; height: number } {
  const display = screen.getPrimaryDisplay()
  const { x: workX, y: workY, width: workWidth, height: workHeight } = display.workArea

  let left = Math.round(workX + (workWidth - width) / 2)
  let top = workY + ISLAND.topOffset

  // Keep island within the active display work area
  const minX = workX
  const maxX = workX + Math.max(0, workWidth - width)
  left = Math.min(Math.max(left, minX), maxX)

  const minY = workY
  const maxY = workY + Math.max(0, workHeight - height)
  top = Math.min(Math.max(top, minY), maxY)

  return {
    x: left,
    y: top,
    width,
    height
  }
}

export function positionIsland(width: number, height: number): void {
  if (!islandWindow || islandWindow.isDestroyed()) return

  const bounds = calculateIslandBounds(width, height)
  islandWindow.setBounds(bounds)
}

export function repositionIsland(): void {
  if (!islandWindow || islandWindow.isDestroyed()) return

  const dimensions = isExpanded ? ISLAND.expanded : ISLAND.compact
  positionIsland(dimensions.width, dimensions.height)
}

const handleDisplayChange = (): void => {
  repositionIsland()
}

function attachDisplayListeners(): void {
  if (displayListenersAttached) return

  screen.on('display-metrics-changed', handleDisplayChange)
  screen.on('display-added', handleDisplayChange)
  screen.on('display-removed', handleDisplayChange)
  displayListenersAttached = true
}

function detachDisplayListeners(): void {
  if (!displayListenersAttached) return

  screen.removeListener('display-metrics-changed', handleDisplayChange)
  screen.removeListener('display-added', handleDisplayChange)
  screen.removeListener('display-removed', handleDisplayChange)
  displayListenersAttached = false
}

export function getIslandWindow(): BrowserWindow | null {
  return islandWindow
}

export function isIslandExpanded(): boolean {
  return isExpanded
}

export function resizeIsland(expanded: boolean): void {
  isExpanded = expanded
  if (!islandWindow || islandWindow.isDestroyed()) return

  const dimensions = expanded ? ISLAND.expanded : ISLAND.compact
  positionIsland(dimensions.width, dimensions.height)
}

export function createIslandWindow(): BrowserWindow {
  if (islandWindow && !islandWindow.isDestroyed()) {
    return islandWindow
  }

  const { width, height } = isExpanded ? ISLAND.expanded : ISLAND.compact

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
  attachDisplayListeners()

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
    detachDisplayListeners()
    islandWindow = null
  })

  return islandWindow
}
