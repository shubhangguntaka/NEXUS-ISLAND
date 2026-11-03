/// <reference types="vite/client" />

import type { AppInfo } from '../../shared/app-info'

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
