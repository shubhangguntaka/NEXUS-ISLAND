import { contextBridge, ipcRenderer } from 'electron'

const nexusAPI = {
  app: {
    getInfo: () => ipcRenderer.invoke('nexus:app:get-info')
  },

  island: {
    setExpanded: (expanded: boolean): Promise<void> =>
      ipcRenderer.invoke('nexus:island:set-expanded', expanded)
  }
}

contextBridge.exposeInMainWorld('nexus', nexusAPI)
