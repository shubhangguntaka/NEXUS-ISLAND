# APPLICATION INVENTORY

## 1. Root-level inventory

The installation root contains the application executable and the packaged Chromium/Electron assets.

### Confirmed root files

- TwoCode.exe — main executable
- TwoCode-Setup.exe — installer bootstrap
- version — packaged version marker
- resources/ — bundled app payload
- resources.pak — embedded app resources package
- locales/ — localization data
- chrome_100_percent.pak, chrome_200_percent.pak — Chromium UI resource archives
- d3dcompiler_47.dll, dxcompiler.dll, dxil.dll — DirectX compiler and support DLLs
- ffmpeg.dll — media encoding/decoding support
- icudtl.dat — ICU data
- v8_context_snapshot.bin — V8 snapshot
- snapshot_blob.bin — Chromium binary blob
- vk_swiftshader.dll, vk_swiftshader_icd.json, vulkan-1.dll — Vulkan software renderer support

### Confirmed application architecture details

- The app is packaged as a portable install folder with Electron runtime files and app assets.
- The package is a Win32 application bundle, not a .NET project by appearance.
- No .csproj, .sln, .vcxproj, .xaml, or WPF files were found in the install root or the bundled app folder.
- The app contains a large amount of JS/CJS/HTML/CSS code in resources/app.

### Executable metadata

Evidence captured from the installation root:

- TwoCode.exe size: 245,726,208 bytes
- TwoCode-Setup.exe size: 158,815,232 bytes
- version file contents: 1.2.0-beta.35 is declared in the app manifest, not the root version marker

Authenticode signature check result:

- TwoCode.exe: Status = NotSigned
- TwoCode-Setup.exe: Status = NotSigned

This is direct evidence from Windows PowerShell Get-AuthenticodeSignature.

## 2. Bundled app inventory

The actual app logic is under:

- C:\Users\gunta\AppData\Local\Programs\TwoCode\resources\app

### File categories

- JavaScript/CommonJS: main.js, ai-monitor-main.cjs, extras-main.cjs, media-main.cjs, project-mode-main.js, settings-app-main.cjs, tray-main.cjs, welcome-main.cjs, shortcuts-main.cjs, and others
- HTML: mascot.html, guard.html, buddy.html, settings-app.html, welcome.html
- CSS/JS UI scripts: pages-ui.js, tools-ui.js, focus-ui.js, spotify-ui.js, chat-ui.js, rest-ui.js, island-window-ui.js, i18n-ui.js
- Windows helper scripts: windows-ai-access.ps1, windows-ai-access.cs, media-session.ps1, volume-watch.ps1, buddy-helper.ps1, buddy-look.ps1
- Tests: resources/app/tests/auto-update.test.cjs, monitor.test.cjs, windows-check.test.cjs, claude-code-hooks.test.cjs, extras.test.cjs
- Assets: assets/ folder with icons and fonts
- Tools: resources/app/tools/ containing packaging and icon-generation scripts

### Package metadata

Source file:

- resources/app/package.json

Key data:

- name: twocode-assistent-electron
- version: 1.2.0-beta.35
- main: main.js
- type: commonjs
- Electron dev dependency: ^44.5.1
- dependency: @openai/codex ^0.160.0

This strongly confirms Electron as the renderer/main platform and an optional direct Codex runtime dependency.

## 3. Framework and technology indicators

### Confident framework classification

- Electron is strongly confirmed.
- The app is not a .NET WPF/WinUI app by evidence from the shipped package.
- It is not a native C++/Qt app by evidence of the app structure and packaged Node/Electron runtime.

### Evidence

- package.json includes Electron and JS entry point.
- code uses Electron APIs directly in every module.
- BrowserWindow and webPreferences are used in settings windows and the island UI.
- preload scripts and contextIsolation are configured in several windows.

### Probable runtime design

- Main process: Node/Electron main thread
- Renderer process: custom HTML/CSS/Canvas UI loaded with BrowserWindow
- Native helpers: Win32 via PowerShell and COM/WinRT operations
- Persistence: JSON files in app.getPath('userData') and OS user data directories

## 4. Installed dependencies and libraries

### Direct dependency evidence

- Electron — confirmed from package.json
- @openai/codex — confirmed as a dependency in package-lock and package.json

### Native runtime support

- Chromium runtime included in app folder
- ffmpeg.dll and D3D compiler support for media and rendering
- PowerShell scripts call WinRT, COM, UIAutomation, and Windows APIs

### Packaging and update logic

- auto-update.cjs and tool scripts show update delivery and install logic.
- The app is designed for direct ZIP replacement updates, not an enterprise installer-only model.

## 5. Runtime resource and configuration analysis

### Configuration files and storage

The app reads and writes local JSON files to the OS user data directory (`app.getPath('userData')`). Examples include:

- twocode-project.json
- twocode-ai-settings.json
- twocode-project-chats.json
- twocode-history.json
- twocode-connection.json
- ai-monitor-auto.json
- ai-monitor-windows.json
- shortcuts.json
- links.json
- tray.json
- note.json
- extras.json

### User profile and app data behaviors

- The app keeps preferences and state locally to the Windows user profile.
- Several modules explicitly store settings and state in separate JSON files and some encrypted storage via Electron safeStorage.

### Packaging mode

- The app supports packaged and unpackaged runs.
- There are both app and app.prev directories under resources, suggesting candidate prior builds or rollback packaging.

## 6. Packaging and source accessibility

### Source accessibility

- The app contains a large amount of readable JS/CJS source in resources/app.
- This source is not obfuscated in the inspected files; it is bundled and readable.
- The app still uses packaged resources (browser assets, Chromium, etc.) and not a purely source-free native bundle.

### Notable indicator

- The presence of `resources/app.prev` suggests a previous version or saved backup bundle in the install package.

## 7. Technical classification

### Most probable implementation type

CONFIRMED: Electron desktop application with custom DOM/Canvas UI and PowerShell/Win32 native helpers.

### Other frameworks ruled out or not evidenced

- Tauri: not evidenced
- WinUI/WPF/.NET: not evidenced by project files or app structure
- Flutter: not evidenced
- Qt/C++: not evidenced in the shipped package

## 8. Evidence references

- resources/app/package.json
- resources/app/main.js
- resources/app/tray-main.cjs
- resources/app/claude-code-hooks.cjs
- resources/app/ai-monitor-main.cjs
- resources/app/mascot.html
- resources/app/windows-ai-access.ps1
- resources/app/media-session.ps1
- resources/app/check-windows.cjs
- C:\Users\gunta\AppData\Local\Programs\TwoCode\TwoCode.exe (status check)
