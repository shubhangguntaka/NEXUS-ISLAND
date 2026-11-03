# IMPLEMENTATION ROADMAP

## Milestone 1: Foundation

### Tasks (Milestone 1)

- Set up Electron + Vite + TypeScript app shell
- Build transparent floating island window
- Implement compact and expanded state transitions
- Add animation system
- Add system tray and startup registration

### Dependencies (Milestone 1)

- Electron base app
- window manager
- reaction to app lifecycle

### Technical challenges (Milestone 1)

- keeping the island non-intrusive and smooth across screens
- handling top-edge positioning and full-screen edge cases

### Estimated complexity (Milestone 1)

Medium

### Acceptance criteria (Milestone 1)

- window appears at the top edge without stealing focus
- compact and expanded states animate properly
- tray and startup registration work on Windows

---

## Milestone 2: Essential Windows features

### Tasks (Milestone 2)

- media session integration
- battery and charging state
- notifications
- volume controls
- brightness integration and basic power state
- timer UI and local timing logic

### Dependencies (Milestone 2)

- Windows feature services layer
- event bus
- state store

### Technical challenges (Milestone 2)

- WinRT/COM differences between versions
- bridging native APIs to UI

### Estimated complexity (Milestone 2)

Medium-high

### Acceptance criteria (Milestone 2)

- media state updates in real time
- notification surfaces present status changes
- volume and battery states are visible and stable

---

## Milestone 3: Advanced integrations

### Tasks (Milestone 3)

- clipboard monitor
- downloads monitor
- file transfer progress
- Bluetooth state and battery
- Wi-Fi state
- CPU, RAM, GPU, and network monitoring

### Dependencies (Milestone 3)

- system service adapters
- analytics normalization layer
- local store for history and settings

### Technical challenges (Milestone 3)

- access controls for sensitive system data
- CPU and network event stability

### Estimated complexity (Milestone 3)

High

### Acceptance criteria (Milestone 3)

- feature cards update without excessive polling
- all features degrade gracefully when unavailable

---

## Milestone 4: AI ecosystem

### Tasks (Milestone 4)

- Claude Code local hooks integration
- Codex local hooks integration
- session tracking and status cards
- approval notification UI
- activity tracking and audits

### Dependencies (Milestone 4)

- AI service abstractions
- event bus
- approval interface

### Technical challenges (Milestone 4)

- local hook reliability across terminal sessions
- handling approval and completion states without breaking user workflows

### Estimated complexity (Milestone 4)

High

### Acceptance criteria (Milestone 4)

- local sessions show real-time status
- user approval requests are explicit and action-oriented
- multiple sessions remain distinguishable

---

## Milestone 5: Customization

### Tasks (Milestone 5)

- theming system
- animation controls
- settings interface
- plugin architecture
- keyboard shortcuts
- custom activity registration

### Dependencies (Milestone 5)

- module registry
- settings persistence
- UI component library

### Technical challenges (Milestone 5)

- ensuring add-on features remain safe and manageable
- balancing theme flexibility versus consistency

### Estimated complexity (Milestone 5)

Medium-high

### Acceptance criteria (Milestone 5)

- theme switching works without visual regressions
- custom activities can be created and prioritized
- shortcuts work reliably without conflicts

---

## Milestone 6: Production

### Tasks (Milestone 6)

- signing and security review
- installer generation
- updater verification
- performance tuning
- crash telemetry review and privacy hardening
- testing and release process

### Dependencies (Milestone 6)

- release pipeline
- security policy
- app lifecycle reliability

### Technical challenges (Milestone 6)

- Windows signature trust and update verification
- performance tuning on limited laptop hardware

### Estimated complexity (Milestone 6)

High

### Acceptance criteria (Milestone 6)

- startup remains smooth on low-spec laptops
- signed updates and rollback path are operational
- app passes release smoke tests
