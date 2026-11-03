# WINDOWS INTEGRATION

This section documents the Windows-specific integrations that are directly evidenced in the app bundle.

## 1. Native Windows APIs and mechanisms observed

### Shell and process integration

- `app.setLoginItemSettings` for startup with Windows: tray-main.cjs
- `globalShortcut` for keyboard shortcuts: shortcuts-main.cjs
- `shell.openExternal` for browser links and external URLs: links-main.cjs, settings-app-main.cjs
- `Tray` and Windows notification API integration: tray-main.cjs and Electron Notification

### UIAutomation / Windows API access

- windows-ai-access.ps1 uses UIAutomationClient and UIAutomationTypes
- PowerShell script reads windows, chat windows, and app titles via Windows automation interfaces
- AI monitoring reads app/window state via native access layer

### WinRT / media integration

- media-session.ps1 uses `[Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]`
- This is the Windows Media Transport Controls API available to WinRT-capable apps
- It tracks current session and reads title/artist/album/cover art

### COM / audio integration

- volume-watch.ps1 and media-session.ps1 implement audio endpoint volume control using IMMDevice, IAudioEndpointVolume, and MMDeviceEnumerator
- This is a legitimate Windows Core Audio approach

### Process and window foreground operations

- ai-monitor-main.cjs calls PowerShell to find original parent windows and brings them to the foreground when necessary
- buddy-helper.ps1 tracks the window under the pointer and performs pointer-based screen analysis
- focus-guard-main.cjs and media-main.cjs report foreground windows and full-screen status

## 2. Confirmed system services used

- Windows Startup registration
- Windows tray icon integration
- Global keyboard shortcuts
- Notification center integration
- Audio endpoint volume access
- Media transport controls
- UIAutomation for application/window inspection
- File system monitoring and local app state

## 3. Windows APIs by purpose

| Purpose | API / mechanism | Evidence |
| --- | --- | --- |
| Startup with Windows | app.setLoginItemSettings | tray-main.cjs |
| Tray icon | electron Tray + Menu | tray-main.cjs |
| Global hotkeys | electron globalShortcut | shortcuts-main.cjs |
| Window focus / activation | PowerShell DllImport user32.dll | ai-monitor-main.cjs |
| Audio volume | IAudioEndpointVolume / Core Audio | media-session.ps1, volume-watch.ps1 |
| Media tracking | Windows.Media.Control | media-session.ps1 |
| Window enumeration | UIAutomation / Win32 API | windows-ai-access.ps1, windows-ai-access.cs |
| Fullscreen detection | SHQueryUserNotificationState | media-session.ps1 |
| Foreground window checks | user32.dll GetForegroundWindow | media-session.ps1 |
| App notifications | Electron Notification | ai-monitor-main.cjs |

## 4. Event-driven or polling patterns

### Confirmed polling patterns

- AI monitor loops on a timer and reads local window state
- Volume watch script checks the master volume at intervals
- Media session script polls Windows and emits JSON when state changes
- Clipboard history is polled every second in extras-main.cjs

### Event-driven patterns

- Claude Code and Codex send hook events to localhost
- BrowserWindow UI updates are pushed with `webContents.send()`
- PowerShell helper outputs JSON lines that are parsed in Node

## 5. Security and permission observations

- The app uses local machine APIs with no obvious cloud credential flow for AI status monitoring.
- It uses PowerShell and local scripts to get system info; this is a normal Windows pattern, but it means the app is sensitive to OS permissions and edge cases.
- `safeStorage` is used for some project-level encryption, which is a legitimate Electron mechanism.

## 6. Windows 10 / 11 differences

### Likely differences relevant to this app

- WinRT media APIs and System Media Transport Controls are available on modern Windows and behave reasonably similarly on Windows 10/11.
- UIAutomation and global hotkeys differ in edge behavior depending on keyboard layout and AltGr combinations.
- The app’s shortcut logic explicitly notes that AltGr conflicts can occur on some keyboard layouts; this is important for Windows keyboard mapping.

### Unknown

- Exact support beyond Windows 10 and 11 is not evidenced in the shipped package.

## 7. NEXUS implementation guidance

NEXUS should independently implement the same capabilities using documented Windows APIs rather than reverse-engineering from TwoCode:

- Startup: `app.setLoginItemSettings` or registry-based startup tasks
- Media: `Windows.Media.Control` and WinRT media sessions
- Audio volume: Core Audio and `IAudioEndpointVolume`
- Foreground window detection: `user32.dll` + `GetForegroundWindow`
- Fullscreen detection: `SHQueryUserNotificationState`
- UIAutomation: official Windows Automation APIs
- System tray: `Tray` and `Menu` in Electron
- Notification center: Electron Notification or WinRT toast APIs if using a .NET layer

## 8. Recommendations for NEXUS

- Keep native integrations behind explicit Windows feature services.
- Validate privileges and fallback gracefully when a Windows API is unavailable.
- Poll only when needed; prefer events for media and agent hooks.
- Do not rely on a single broad PowerShell script for all features; split them by service and purpose.
