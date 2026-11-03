# FEATURE CATALOG

This catalog organizes the features that are directly supported by source evidence and by the product description included with the app bundle.

## A. Dynamic Island UI

| Feature | Description | Availability | Trigger | Evidence |
| --- | --- | --- | --- | --- |
| Compact island | Small floating status pill | CONFIRMED | App startup / user interaction | resources/app/mascot.html, UI constants for COMPACT_W and COMPACT_H |
| Expanded state | Larger panel for activities and settings | CONFIRMED | UI expands from compact mode | resources/app/mascot.html, main.js, pages-ui.js |
| Collapsed/tucked mode | Island hides or reduces until needed | CONFIRMED | Tuck shortcut or app logic | resources/app/tuck-ui.js, tray-main.cjs, shortcuts-main.cjs |
| Transparency and glass look | Transparent background, blurred/rounded effect | CONFIRMED | UI CSS and BrowserWindow settings | resources/app/mascot.html, main.js |
| Top-edge positioning | Sticks to screen top edge or float gap | CONFIRMED | ISLAND_FLOAT_GAP and screen positioning logic | resources/app/main.js |
| Auto-hide / inactivity behavior | Island can tuck away based on mouse/visibility state | CONFIRMED | Event-driven UI state logic | resources/app/mascot.html and island-window-ui.js |
| Custom notebook-like panels | Multi-page island UI | CONFIRMED | View management and page switches | resources/app/pages-ui.js |
| Keyboard activation | Ctrl+Alt+T and custom key combos | CONFIRMED | globalShortcut registration | resources/app/shortcuts-main.cjs |

## B. AI Coding Agent Integration

### Confirmed AI providers

- Claude Code
- Codex
- ChatGPT (planned/partial product messaging and code support)

### Confirmed implementation pattern

- Local hook server on 127.0.0.1 on port 47823
- Claude settings.json hook injection
- ~/.codex/hooks.json injection for Codex
- Local session tracking and notification routing

### Evidence

- resources/app/claude-code-hooks.cjs
- resources/app/ai-monitor-main.cjs
- resources/app/ai-monitor-model.cjs
- resources/app/chatgpt-provider.js

### AI feature behaviors

- Detect active terminal or VS Code windows tied to Claude Code/Codex
- Read session status from local hooks
- Bring related app window to foreground when needed
- Ask for user permission/approval in the UI
- Support answer dispatch and plan approval flows
- Present notifications for question, completion, error, and wait states

## C. Notification System

| Feature | Status | Evidence |
| --- | --- | --- |
| Windows notifications for AI state | CONFIRMED | ai-monitor-main.cjs uses Electron Notification |
| In-island status/traffic-light notifications | CONFIRMED | ai-monitor-ui.js, ai-monitor-model.cjs |
| Notification click-to-focus behavior | CONFIRMED | ai-monitor-main.cjs notification.on('click') |
| Language-localized notification text | CONFIRMED | ai-monitor-main.cjs dutch() helper |
| Silent or non-intrusive modes | INFERRED | settings and notifyEnabled variable |

## D. Music and Media

| Feature | Status | Evidence |
| --- | --- | --- |
| System media state detection | CONFIRMED | media-session.ps1 uses Windows.Media.Control |
| Local music fallback | CONFIRMED | media-main.cjs uses Windows media session when no Spotify login is available |
| Spotify login integration | CONFIRMED | media-main.cjs and main.js reference Spotify Web API |
| Device switching / transfer | CONFIRMED | media-main.cjs: devices and transfer methods |
| Play/pause/next/previous/seek control | CONFIRMED | media-session.ps1 commands and media-main.cjs wrappers |
| Cover art extraction | CONFIRMED | media-session.ps1 serializes art data |
| Volume integration | CONFIRMED | extras-main.cjs and media-main.cjs |
| Fullscreen detection for game mode | CONFIRMED | media-session.ps1 and game-mode-main.cjs |

## E. Windows System Integration

| Feature | Status | Evidence |
| --- | --- | --- |
| Startup with Windows | CONFIRMED | tray-main.cjs app.setLoginItemSettings |
| Tray icon and menu | CONFIRMED | tray-main.cjs |
| Custom shortcut registration | CONFIRMED | shortcuts-main.cjs |
| Clipboard monitoring | CONFIRMED | extras-main.cjs readClipboard() |
| File tray | CONFIRMED | extras-main.cjs tray functions |
| Quick note | CONFIRMED | extras-main.cjs note-get / note-set |
| Calendar/weather extras | CONFIRMED | extras-main.cjs |
| Bluetooth battery detection | CONFIRMED | extras-main.cjs readBluetooth() |
| Volume monitoring | CONFIRMED | media-main.cjs, volume-watch.ps1 |
| CPU and memory stats | CONFIRMED | system-main.cjs |
| Game mode/Do Not Disturb integration | CONFIRMED | game-mode-main.cjs, media-session.ps1 |
| Focus guard | CONFIRMED | focus-guard-main.cjs |
| Window detection and foreground app monitoring | CONFIRMED | buddy-helper.ps1, buddy-main.cjs |

## F. Customization

| Feature | Status | Evidence |
| --- | --- | --- |
| User preferences | CONFIRMED | twocode-fun.js and welcome flow |
| AI connection choices | CONFIRMED | settings-app-main.cjs and welcome-main.cjs |
| Language selection | CONFIRMED | i18n-ui.js, welcome-main.cjs |
| Custom names / Robo persona | CONFIRMED | welcome-main.cjs |
| Settings app | CONFIRMED | settings-app-main.cjs |
| Keyboard short-cuts | CONFIRMED | shortcuts-main.cjs |
| Links and quick access tiles | CONFIRMED | links-main.cjs |
| Theme switching | INFERRED | settings app and theme logic |

## G. Other features

- Focus timer and session flow: confirmed in focus-ui.js and twocode-fun.js
- Chat with AI through island UI: confirmed in chat-ui.js and buddy-main.cjs
- File/droppable tray: confirmed in extras-main.cjs
- Auto-update mechanism: confirmed in auto-update.cjs and auto-update-core.cjs
- Uninstallation flow: confirmed in uninstall-main.cjs
- Safety graphics option: confirmed in graphics-main.cjs
- Buddy / drag-out assistant: confirmed in buddy-main.cjs and buddy.html

## Feature summary by product category

### Confirmed and relevant to NEXUS

- Dynamic island shell
- AI activity monitoring with local hooks
- Permission gating for AI actions
- Local background monitoring and state broadcasting
- Windows startup and system tray
- Music/volume/media session control
- Clipboard and quick note
- File tray and active context
- Focus and timer management
- Multi-window settings and welcome flow

### Partial/incomplete or implementation-limited features

- Some AI integrations are local to OS events and may depend on the actual user environment.
- App uses a mix of direct hooks and local polling, which may be heavier than necessary.
- Some features are clearly implemented as local helper scripts and not as a clean modular architecture.

## NEXUS priority classification

- High priority: AI activity awareness, permission UX, dynamic island shell, system tray, media controls, system health, focus, notifications
- Medium priority: clipboard tray, quick links, custom themes, buddy interactions
- Low priority: mascot persona or decorative robot motion unless used as a brand layer

---

## Example of feature metadata used for NEXUS planning

Feature name: AI permission approval
Description: When Claude Code/Codex requests permission, TwoCode can present a local approval request and allow/deny.
Availability: Confirmed
Trigger: Local hook events from agent actions
UI behaviour: In-island traffic-light and approval cards
Interaction: Allow/Deny in app
Technical mechanism: Local HTTP server and permission hooks via claude-code-hooks.cjs
NEXUS priority: High
