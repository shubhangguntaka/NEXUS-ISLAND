# EVIDENCE INDEX

This index lists the most relevant evidence files used in this investigation.

## 1. Package and app identity

- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\package.json
  - Confirms Electron and app version 1.2.0-beta.35
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\README.md
  - Product description and public feature summary
- C:\Users\gunta\AppData\Local\Programs\TwoCode\TwoCode.exe
  - Executable metadata and NotSigned status
- C:\Users\gunta\AppData\Local\Programs\TwoCode\TwoCode-Setup.exe
  - Installer metadata and NotSigned status

## 2. Application architecture

- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\main.js
  - module startup and architecture bootstrap
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\tray-main.cjs
  - tray icon, startup registration, single instance behavior
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\settings-app-main.cjs
  - settings app and overall app-window flow
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\mascot.html
  - island shell, dynamic sizes, state values, and UI renderer

## 3. AI and build/agent integration

- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\claude-code-hooks.cjs
  - local Claude Code and Codex hook model
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\ai-monitor-main.cjs
  - AI session observation, permission requests, notifications
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\chatgpt-provider.js
  - Codex runtime and sandbox model
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\ai-monitor-model.cjs
  - state model for agent sessions

## 4. Windows integration and native helpers

- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\windows-ai-access.ps1
  - PowerShell UIAutomation-based access
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\media-session.ps1
  - WinRT media session + volume + fullscreen detection
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\volume-watch.ps1
  - volume watcher script
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\buddy-helper.ps1
  - pointer and window inspection helper
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\check-windows.cjs
  - evidence for native window inspection and app state reading

## 5. Media, extras, and productivity features

- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\media-main.cjs
  - media controls and Windows fallback logic
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\extras-main.cjs
  - tray, clipboard, note, weather, calendar, volume, Bluetooth
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\system-main.cjs
  - CPU and memory stats
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\focus-ui.js
  - focus timer UI
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\links-main.cjs
  - custom quick links

## 6. UI and product identity

- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\mascot.html
  - island visual shell and state sizing
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\pages-ui.js
  - page and screen switching behavior
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\i18n-ui.js
  - localization and product copy
- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app\icons-ui.js
  - iconography and status glyphs

## 7. Official documentation references

- Electron main process documentation: <https://www.electronjs.org/docs/latest/api/app>
- Electron BrowserWindow documentation: <https://www.electronjs.org/docs/latest/api/browser-window>
- Windows Media Controls documentation: <https://learn.microsoft.com/windows/uwp/audio-video-camera/system-media-transport-controls>
- Core Audio volume controls: <https://learn.microsoft.com/windows/win32/coreaudio/core-audio-apis>
- UI Automation documentation: <https://learn.microsoft.com/windows/win32/winauto/automation-index>
- Windows startup registration: <https://learn.microsoft.com/windows/desktop/shell/launch-windows>

## 8. Confidence levels

- High confidence: Electron architecture, tray integration, island shell, local AI hooks, media session monitoring, volume access, global shortcuts, local JSON storage
- Medium confidence: some feature completeness around Bluetooth/Wi-Fi/charging and custom activity system due to partial code comments and not full runtime validation
- Low confidence: exact performance metrics and some runtime UX elements because no live app execution was performed in this session
