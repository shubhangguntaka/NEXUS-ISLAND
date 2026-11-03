# NEXUS ISLAND RESEARCH PACKAGE

## Executive summary

This package documents a static investigation of the TwoCode application located at:

- C:\Users\gunta\AppData\Local\Programs\TwoCode

The application is a Windows desktop app built with Electron, packaged as a standalone folder with a Win32 executable and a bundled resources/app tree. The strongest evidence is in the shipped package metadata and source files in resources/app, not in a separate external repo.

### Confirmed findings

- The shipped app is Electron-based. Evidence: resources/app/package.json declares "main": "main.js", uses Electron as a dev dependency, and the code directly imports Electron APIs like app, BrowserWindow, Tray, ipcMain, globalShortcut, Notification, and BrowserWindow webContents.
- The app is Windows-focused. Evidence: PowerShell-based hooks, Win32/WinRT access, AppUserModelId registration, and Windows startup/login integration in tray-main.cjs and various helper scripts.
- The UI is a transparent floating island window atop the screen edge, with a custom canvas-based renderer and a custom HTML/CSS shell. Evidence: resources/app/mascot.html and resources/app/main.js.
- It tracks AI coding agents, especially Claude Code and Codex, using local hook files and HTTP callbacks on 127.0.0.1. Evidence: resources/app/claude-code-hooks.cjs and resources/app/ai-monitor-main.cjs.
- It integrates with music, local volume, clipboard, tray/file collections, focus timers, and system state. Evidence: resources/app/media-main.cjs, extras-main.cjs, system-main.cjs, focus-ui.js, shortcuts-main.cjs.

### Research status

- Static inspection completed: yes
- Runtime launch of the app: not performed in this session, intentionally avoided
- Original TwoCode files modified: no
- Research files created outside the installation: yes

### Confidence labels used in this research

- CONFIRMED: directly observed in source or metadata
- INFERRED: strongly likely but not directly proven by execution
- UNKNOWN: not verifiable from the available package

### Key takeaways for NEXUS ISLAND

1. The best product pattern to adopt is a lightweight floating island window with compact/expanded states and local background services.
2. A Windows-first architecture using Electron is viable, but NEXUS should keep the runtime slimmer by reducing background polling and using lazy module loading.
3. The most valuable features are the activity model, Windows behavior integration, and approval prompts for AI operations.
4. The most important improvements are firmer IPC validation, clearer permission boundaries, and reduced power consumption.

---

## High-level product understanding

TwoCode is best understood as a Windows desktop companion app that lives as a translucent top-edge “Dynamic Island” panel. It monitors local system state, listens for local Claude/Codex events, presents notifications and commands, and allows lightweight user interactions without a cloud auth flow.

The app present in this workspace is version 1.2.0-beta.35 according to package.json. It is clearly a prototype or beta app, not a polished production release.

The product is highly opinionated: it packages a custom robot/mascot persona, custom UI, and a narrow set of features centered around AI activity awareness and local status.

---

## Immediate evidence summary

- package.json: resources/app/package.json
- main app entry: resources/app/main.js
- dynamic island shell: resources/app/mascot.html
- activity and AI monitoring: resources/app/ai-monitor-main.cjs, ai-monitor-model.cjs, claude-code-hooks.cjs
- Windows integration: resources/app/media-session.ps1, windows-ai-access.ps1, check-windows.cjs, volume-watch.ps1
- tray/startup handling: resources/app/tray-main.cjs
- settings/connection UI: resources/app/settings-app-main.cjs
- extras and local utilities: resources/app/extras-main.cjs, system-main.cjs, focus-ui.js

These files make the application architecture readable without executing any installer or binary.
