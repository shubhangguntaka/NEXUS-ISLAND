# SECURITY AND PRIVACY ANALYSIS

## 1. Security posture summary

The inspected app is a local-first desktop application with a mixed model of local state and OS-level integrations. It appears designed to operate primarily on the user’s machine and does not depend on a central cloud account for core activity tracking.

### Confirmed positive characteristics

- Local preference storage in userData
- No obvious cloud login requirement for the core island behavior
- Local AI status is monitored without sending it to a remote TwoCode service by default
- `safeStorage` is used in project-mode-main.js for secure local secrets handling when available
- App code includes filters to prevent sensitive file names (credentials, .env, keys, etc.) from being scanned or exposed by project mode

### Notable negative or risk-laden characteristics

- Direct PowerShell execution is used for sensitive OS functions
- Some scripts can access foreground windows, active media, and window titles
- The app includes hooks that can inject commands into user-local Claude/Codex config files
- Local machine access is broad; the app intentionally has privileges to observe and manipulate local workflows
- The app bundle was not signed by Authenticode in this installation, which is a risk from a trust standpoint

## 2. Local storage and persistence

The app writes JSON into `app.getPath('userData')` for many features, including:

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

This is a local-first data model, which is appropriate for a desktop productivity assistant.

## 3. Privacy disclosures in the app

The README states:

- "TwoCode runs on your own PC and needs no TwoCode account."
- "The status of Claude Code and Codex is read locally and sent nowhere."
- "When you ask Robo something, it goes to the AI you connected yourself, the same way as when you use it in your terminal."

This is direct evidence from resources/app/README.md.

## 4. Security boundaries

### Confirmed boundaries

- renderer windows use `contextIsolation: true` and `nodeIntegration: false` in several windows
- some IPC handlers enforce trusted sender checks based on file URLs and origin policy
- app modules validate sender URLs before accepting renderer requests

### Risk areas

- The app is broad and feature-rich; the main process may accept IPC from the island if a trusted sender check fails or is bypassed
- Native helper scripts run with local OS privileges and can observe local content; this should be treated as a privileged surface
- Global system hotkeys and tray app behaviors should be treated as privileged system actions

## 5. Update security

The app includes:

- auto-update.cjs
- auto-update-core.cjs
- update-public-key.txt

This indicates a signed or key-verified update flow is planned or partially implemented. However, the shipped executable itself is not signed in this install, so the chain of trust is not fully established at runtime.

## 6. Key risks and recommendations

### Risks

- unsigned binary in the install root
- broad local OS access via PowerShell and UIAutomation
- local command injection risk if hook files are manipulated
- broad file-system scanning unless carefully gated

### NEXUS design requirements

- Keep renderer processes isolated with context isolation enabled
- Disable Node integration in renderer windows
- Validate every IPC route with explicit sender checks and strict message schemas
- Use local-first SQLite or JSON storage with encryption at rest where needed
- Require explicit user consent before exposing external app data or clipboard content
- Avoid unnecessary telemetry and do not transmit local AI status to vendor services unless the user opts in
- Verify update payload signatures and keep a rollback path

## 7. Recommended security policy for NEXUS

- Context isolation on every BrowserWindow
- Sandboxed preload APIs only
- Strict allowlists for IPC channels
- Explicit permission to capture audio, window content, or clipboard
- OS-level access implemented through dedicated services with minimal privileges
- Avoid broad shell execution without user approval

## 8. Final assessment

The app is privacy-aware at a product level but has a significant OS-integration surface area. That is expected for a local assistant, but it means NEXUS should intentionally design its security boundaries carefully and treat native tooling as privileged rather than ordinary app state.
