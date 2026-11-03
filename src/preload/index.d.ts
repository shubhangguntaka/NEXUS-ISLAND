import type { AppInfo } from '../shared/app-info'

declare global {
  interface Window {
    nexus: {
      app: {
        getInfo: () => Promise<AppInfo>
      }
      island: {
        setExpanded: (expanded: boolean) => Promise<void>
      }
    }
  }
}

export {}
