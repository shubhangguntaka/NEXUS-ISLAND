import { useEffect, useState } from 'react'
import type { AppInfo } from '../../shared/app-info'

function App(): React.JSX.Element {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.nexus.app
      .getInfo()
      .then(setAppInfo)
      .catch((err: unknown) => {
        console.error('Failed to retrieve NEXUS application info:', err)
        setError('Could not connect to the NEXUS main process.')
      })
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0b1020',
        color: '#f8fafc',
        fontFamily: 'Segoe UI, sans-serif'
      }}
    >
      <section style={{ textAlign: 'center', padding: 32 }}>
        <div
          style={{
            width: 64,
            height: 64,
            margin: '0 auto 20px',
            borderRadius: 20,
            background: '#1e293b',
            display: 'grid',
            placeItems: 'center',
            fontSize: 28,
            fontWeight: 700
          }}
        >
          N
        </div>

        <h1 style={{ fontSize: 30, marginBottom: 8 }}>NEXUS ISLAND</h1>

        <p style={{ color: '#94a3b8' }}>Your desktop. Connected.</p>

        {appInfo ? (
          <p style={{ color: '#64748b', fontSize: 12, marginTop: 24 }}>
            Version {appInfo.version} · {appInfo.platform}
          </p>
        ) : error ? (
          <p style={{ color: '#f87171', marginTop: 24 }}>{error}</p>
        ) : (
          <p style={{ color: '#94a3b8', marginTop: 24 }}>Initializing NEXUS...</p>
        )}
      </section>
    </main>
  )
}

export default App
