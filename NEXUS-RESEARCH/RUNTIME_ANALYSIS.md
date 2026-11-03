# RUNTIME ANALYSIS

## 1. Startup model

The app startup flow is defined in resources/app/main.js and resources/app/tray-main.cjs.

### Confirmed startup sequence

1. self-install.cjs handles transferred startup or installed app init
2. graphics-main.cjs is loaded early
3. tray-main.cjs bootstraps the Windows tray icon and single-instance lock
4. island window is created and the main features are registered
5. AI monitoring, settings, extras, media, links, system stats, and other modules initialize

### Single-instance behavior

- tray-main.cjs enforces a single-instance lock
- If another instance starts, the app redirects to open the island or handle the new request

## 2. Background activity

The application continuously tracks:

- AI agent status from local hook systems
- Media session state
- Clipboard changes
- Volume changes
- Bluetooth battery status
- Foreground window state and focus guard state
- CPU and memory usage
- Updates and notifications

This makes the app a continuous local monitor rather than a purely on-demand utility.

## 3. Background processes and helper scripts

### Confirmed native helper scripts

- media-session.ps1
- volume-watch.ps1
- windows-ai-access.ps1
- buddy-helper.ps1
- buddy-look.ps1

These scripts run as PowerShell subprocesses to read Windows information and forward JSON back to the app.

## 4. Startup and lifecycle behaviors

### Confirmed lifecycle patterns

- `app.whenReady()` is used to initialize tray, shortcuts, and windows
- `app.on('will-quit')` cleans up child processes and tray state
- `app.on('before-quit')` is used for session teardown and safety logic
- there are explicit restarts and application relaunches through `relaunch()`

## 5. Resource observations based on static source

This workbook does not benchmark the app by launching it. There are no runtime measurements from the current environment and no safe benchmark result can be claimed.

However, the code makes several resource-conscious design choices:

- some helper processes are created lazily
- some features use polling intervals rather than continuous full-frame rendering
- game mode hides the island to reduce GPU work when full-screen apps are active
- the buddy helper is intentionally torn down after a few minutes of idle time

These are strong indicators of performance-sensitive design, even though exact CPU/RAM values remain unknown.

## 6. Activity lifecycle patterns

The app appears to model activities as stateful objects with statuses such as:

- ready
- running
- question
- permission request
- done
- error

This is visible in ai-monitor-model.cjs, ai-monitor-main.cjs, and claude-code-hooks.cjs.

## 7. Event architecture

The architecture is event-driven loosely in the sense that:

- local hooks trigger changes
- background helpers emit JSON lines
- Electron IPC pushes updates to the UI
- the island itself keeps a dynamic state machine for views and activity pages

## 8. Performance strengths and risks

### Strengths

- Local, on-machine work reduces network overhead
- PowerShell helpers are targeted, not broad system scans by default
- Some features are lazy-initialized
- Full-screen mode minimizes render cost

### Risks

- Multiple background helpers may increase memory and process count
- Polling-based clipboard and volume checks create periodic work
- Native helper sprawl can be harder to track and debug

## 9. NEXUS recommendations

For NEXUS, the design should prioritize:

- event-driven native services rather than repeated polling
- a single shared state/event bus
- lazy module setup and background service startup
- explicit lifecycle cleanup for helper processes
- low CPU idle behavior on laptops with 8 GB RAM or less

## 10. Unknown runtime measures

The following cannot be established from static inspection alone:

- idle CPU usage
- active CPU usage under real load
- RAM footprint on a laptop
- true startup time
- disk churn
- GPU utilization

Those values must be measured using a safe, approved runtime test environment outside this research package.
