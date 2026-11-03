import { contextBridge, ipcRenderer } from 'electron'

const nexusAPI = {
  app: {
    getInfo: () => ipcRenderer.invoke('nexus:app:get-info')
  }
}

contextBridge.exposeInMainWorld('nexus', nexusAPI)

import type { AppInfo } from '../shared/app-info'

declare global {
  interface Window {
    nexus: {
      app: {
        getInfo: () => Promise<AppInfo>
      }
    }
  }
}

export {}
