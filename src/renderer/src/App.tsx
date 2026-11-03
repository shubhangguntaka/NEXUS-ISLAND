import { useEffect, useState } from 'react'
import type { AppInfo } from '../../shared/app-info'

function App(): React.JSX.Element {
  const [expanded, setExpanded] = useState(false)
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.nexus.app
      .getInfo()
      .then(setAppInfo)
      .catch(() => setError('Connection unavailable'))
  }, [])

  const toggleIsland = async (): Promise<void> => {
    const nextState = !expanded

    try {
      await window.nexus.island.setExpanded(nextState)
      setExpanded(nextState)
    } catch (err) {
      console.error('Island resize failed:', err)
    }
  }

  return (
    <main className="island-container">
      <button
        className={`island ${expanded ? 'island-expanded' : 'island-compact'}`}
        onClick={() => void toggleIsland()}
        aria-expanded={expanded}
        aria-label={expanded ? 'Collapse NEXUS Island' : 'Expand NEXUS Island'}
      >
        <div className="island-header">
          <div className="brand-mark">N</div>

          <div className="brand-content">
            <span className="brand-name">NEXUS</span>
            <span className="brand-caption">Your desktop companion</span>
          </div>

          <span className="status-indicator" />
        </div>

        <div className={`island-details ${expanded ? 'visible' : ''}`}>
          <div className="island-divider" />

          <div className="welcome-section">
            <span className="welcome-title">Your desktop. Connected.</span>
            <span className="welcome-description">Everything you need, in one place.</span>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <span className="feature-icon">✦</span>
              <span className="feature-name">AI Assistant</span>
              <span className="feature-status">Ready</span>
            </div>

            <div className="feature-card">
              <span className="feature-icon">◈</span>
              <span className="feature-name">System</span>
              <span className="feature-status">Connected</span>
            </div>

            <div className="feature-card">
              <span className="feature-icon">⌘</span>
              <span className="feature-name">Quick Actions</span>
              <span className="feature-status">Available</span>
            </div>
          </div>

          <div className="island-footer">
            {error ? error : appInfo ? `NEXUS ISLAND · v${appInfo.version}` : 'Initializing...'}
          </div>
        </div>
      </button>
    </main>
  )
}

export default App
