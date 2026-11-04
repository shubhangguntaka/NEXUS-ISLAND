# NEXUS ISLAND — Software Architecture Blueprint

**Version:** 1.1.0  
**Target Platform:** Windows 11  
**Architecture Classification:** Electron + React + Native Windows Services

---

## 1. Architectural Principles

1. **Local-First & Privacy Enforced**: No user telemetry, continuous screen monitoring, or mandatory cloud subscriptions. All configuration, logs, and database files remain local to the user's Windows profile.
2. **Resource-Conscious by Design**: Tuned for mid-range hardware (Intel i5-1135G7, 8 GB RAM). Event-driven native notifications replace polling loops; idle CPU is kept under 1% and baseline memory under 120 MB.
3. **Strict Process Isolation**: Zero direct Node.js or native module exposure to renderer processes. Every IPC boundary is strongly typed and guarded by Zod validation schemas.
4. **Human-in-the-Loop Priority**: Automated actions (AI Cursor, system commands) yield immediately to physical user input with hardwired emergency stops.

---

## 2. High-Level Process Architecture

```mermaid
flowchart TD
    subgraph WindowsOS [Windows 11 Operating System]
        WinAPI[Win32 / CoreAudio / MediaSession]
        FS[User AppData / SQLite]
        Display[Screen Metrics / WorkArea]
    end

    subgraph MainProcess [Electron Main Process (Node.js)]
        AppLifecycle[App Lifecycle & Single Instance]
        WindowManager[Island Window Manager]
        DisplayResilience[Display Metrics & Bounds Clamping]
        TrayManager[System Tray Controller]
        IpcRouter[IPC Central Router]
        IpcApp[App Information Handler]
        IpcIsland[Island State Handler]
        NativeAdapters[Native Windows Adapters]
        SecurityGuard[Origin & Window Authorization]

        AppLifecycle --> WindowManager
        AppLifecycle --> TrayManager
        WindowManager --> DisplayResilience
        DisplayResilience --> Display
        AppLifecycle --> IpcRouter
        IpcRouter --> IpcApp
        IpcRouter --> IpcIsland
        IpcIsland --> SecurityGuard
        IpcIsland --> WindowManager
        IpcRouter --> NativeAdapters
        NativeAdapters --> WinAPI
        NativeAdapters --> FS
    end

    subgraph PreloadBoundary [Context Bridge Sandbox]
        Bridge[window.nexus API]
    end

    subgraph RendererProcess [Renderer Process (Chromium)]
        ReactRoot[React 19 Application]
        ZustandStore[Zustand State Store]
        IslandPill[Island Engine View]
        Widgets[Modular Widgets: System, AI, Quick Actions]

        ReactRoot --> ZustandStore
        ZustandStore --> IslandPill
        IslandPill --> Widgets
        ZustandStore --> Bridge
    end

    MainProcess <== Context Isolated IPC ==> PreloadBoundary
    PreloadBoundary <== Expose In Main World ==> RendererProcess
```

---

## 3. Directory & Module Organization

To prevent monolithic decay, the application adheres to a modular directory hierarchy:

```text
├── src/
│   ├── main/
│   │   ├── index.ts                # Application lifecycle entry point & coordinator
│   │   ├── windows/                # Window definitions & display math
│   │   │   ├── island-window.ts    # Floating island window & display resilience controller
│   │   │   └── overlay-window.ts   # Future AI Cursor virtual overlay
│   │   ├── ipc/                    # Type-safe IPC handler registrations
│   │   │   ├── app-handlers.ts     # Application metadata IPC handler
│   │   │   ├── island-handlers.ts  # Island expansion & sizing IPC handler
│   │   │   └── register.ts         # Centralized IPC registration entry point
│   │   ├── services/               # Native Windows services (future milestones)
│   │   │   ├── display-service.ts  # Multi-monitor tracking & display selection
│   │   │   ├── tray-service.ts     # Taskbar notification area icon & menus
│   │   │   └── storage-service.ts  # SQLite & Windows DPAPI secure storage
│   │   └── security/               # Origin guards & URL opening policy
│   ├── preload/
│   │   ├── index.ts                # Context bridge definition
│   │   └── index.d.ts              # Global Window augmentation
│   ├── shared/
│   │   ├── app-info.ts             # Application metadata schema & types
│   │   ├── island-state.ts         # Island geometry & expansion schema
│   │   ├── ipc-channels.ts         # Shared IPC channel constants
│   │   └── system-state.ts         # Battery, audio, and media schemas
│   └── renderer/
│       ├── index.html              # HTML shell with CSP
│       └── src/
│           ├── main.tsx            # React root mount
│           ├── App.tsx             # Root island container
│           ├── env.d.ts            # Renderer ambient types
│           ├── assets/             # CSS stylesheets and static assets
│           ├── features/           # Modular domain features
│           │   ├── island/         # Dynamic island layouts & transitions
│           │   ├── system/         # Media & hardware widgets
│           │   ├── ai/             # AI companion & activity states
│           │   └── productivity/   # Focus timer, notes, quick actions
│           ├── stores/             # Zustand stores for reactive UI state
│           └── components/         # Reusable UI primitives
├── tests/
│   └── unit/
│       └── shared-schemas.test.ts  # Vitest unit tests for shared Zod contracts
├── vitest.config.ts                # Vitest configuration for lightweight unit testing
```

---

## 4. Module Responsibilities (Main Process)

### `src/main/index.ts`

- Sets application metadata and Windows User Model ID (`com.shubhang.nexusisland`).
- Watches window shortcuts via `@electron-toolkit/utils`.
- Invokes `registerIpcHandlers()` upon application ready.
- Creates initial `islandWindow`.
- Handles platform lifecycle events (`activate`, `window-all-closed`).

### `src/main/windows/island-window.ts`

- Instantiates frameless, transparent, always-on-top `BrowserWindow` with strict webPreferences.
- Manages geometry state (`compact`: 220x64px, `expanded`: 460x220px, `topOffset`: 12px).
- Handles display change events (`display-metrics-changed`, `display-added`, `display-removed`).
- Implements `calculateIslandBounds` to clamp positioning within primary display work area bounds.
- Prevents duplicate display event listeners and cleans them up on window close.

### `src/main/ipc/app-handlers.ts`

- Registers `nexus:app:get-info` IPC handler.
- Gathers system/app information and parses through `appInfoSchema`.

### `src/main/ipc/island-handlers.ts`

- Registers `nexus:island:set-expanded` IPC handler.
- Validates payload with `islandExpandedSchema`.
- Verifies sender identity against `getIslandWindow()` to block unauthorized frames.

### `src/main/ipc/register.ts`

- Centralizes IPC handler registrations across subsystems.

---

## 5. Security Architecture

1. **WebPreferences Sandbox**:
   - `contextIsolation: true`
   - `nodeIntegration: false`
   - `sandbox: true`
   - `webSecurity: true`
2. **ContextBridge Exposure**:
   - The renderer interface is accessible only under the `window.nexus` namespace.
   - Methods return sanitized promises or invoke strictly typed IPC channels.
3. **IPC Authorization & Schema Validation**:
   - Every `ipcMain.handle` invocation verifies the sender:
     ```typescript
     const senderWindow = BrowserWindow.fromWebContents(event.sender)
     if (!islandWindow || senderWindow !== islandWindow) {
       throw new Error('Unauthorized island window request')
     }
     ```
   - Input payloads are parsed through Zod schemas before being passed to business logic.
4. **External URL Policy**:
   - In-app window opening is denied via `setWindowOpenHandler`.
   - Safe HTTP/HTTPS protocols are handed off to OS shell (`shell.openExternal`).

---

## 6. Testing Strategy

- **Test Runner**: Vitest (`vitest.config.ts`) executing in Node.js environment.
- **Unit Testing**: Tests contracts and schemas in `tests/unit/`.
- **Scripts**:
  - `npm test`: Runs one-pass test suite (`vitest run`).
  - `npm run test:watch`: Runs interactive watch mode for TDD.
