# RESEARCH GAPS

This document lists what cannot be fully established from the package without a safe runtime check or codebase access beyond the installed bundle.

## 1. Still unknown from static inspection

- Exact real-world UX behavior of the island under active use
- Pixel perfect measurements of animation timing and motion curves
- Real CPU and RAM usage under realistic workloads
- GPU load and frame budget when the island is expanded
- Exact set of all app settings available in the production UI
- Whether some modules are dormant or disabled in specific versions
- Whether the app depends on hidden or optional OS-level services not visible in the shipped bundle

## 2. Gaps in feature coverage

### AI features

- Some AI flows are strongly indicated but not fully mapped at runtime.
- The actual approval UX may depend on user state and session state not visible in the static code.

### Windows integration details

- Battery/charging and Wi-Fi behavior are partially present but not fully documented by the code.
- Bluetooth support is likely present but not completely proven across various hardware configurations.

### Product-specific runtime behaviour

- The app may have not-yet-included features or dynamic modules that are only loaded when a user chooses them
- The actual system tray experience and notification frequency were not observed live

## 3. Safe investigation recommendations

If additional investigation is allowed, the next safe steps would be:

1. Run the app in a controlled test environment, without personal credentials or production data.
2. Capture startup logs and window state transitions using the app’s own debug features.
3. Inspect the runtime UI, tray, settings window, and screen positions under a standard Windows 11 laptop configuration.
4. Verify the event flows for AI sessions, media state, clipboard, and tray interactions.
5. Measure idle and active resource consumption using a clean Windows test machine.

## 4. Explicit not-verified items

- actual software signing chain beyond the unsiged status observed
- vendor or third-party telemetry behavior beyond the disclosed local-first model
- runtime network requests beyond the ones evident in source comments and helper URLs

## 5. Missing documentation for NEXUS

To avoid guessing, NEXUS should independently validate:

- official Windows API support for actual hardware capabilities
- user consent flow for system-wide monitoring
- low-power media and audio detection strategies
- stable multi-monitor behavior and top-edge island placement
- test coverage for AI hook events across different Windows shells and layouts
