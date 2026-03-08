import { useState } from 'react'

const API = 'http://localhost:8000'

function Home() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resetting, setResetting] = useState(false)

  const runIngest = async () => {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch(`${API}/ingest`, { method: 'POST' })
      if (!res.ok) throw new Error('Ingest failed')
      const data = await res.json()
      setStatus({ success: true, message: data.message })
    } catch (err) {
      setStatus({ success: false, message: err.message })
    } finally {
      setLoading(false)
    }
  }

  const runReset = async () => {
    if (!window.confirm('This will delete all products and projects. Continue?')) return
    setResetting(true)
    setStatus(null)
    try {
      const res = await fetch(`${API}/reset`, { method: 'POST' })
      if (!res.ok) throw new Error('Reset failed')
      const data = await res.json()
      setStatus({ success: true, message: data.message })
    } catch (err) {
      setStatus({ success: false, message: err.message })
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="page">
      <h1>Home</h1>
      <p>Welcome to the Product Catalog.</p>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={runIngest}
          disabled={loading || resetting}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            background: '#646cff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Ingesting...' : 'Seed Product Data'}
        </button>
        <button
          onClick={runReset}
          disabled={loading || resetting}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            background: '#ff4444',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: resetting ? 'not-allowed' : 'pointer',
            opacity: resetting ? 0.6 : 1,
          }}
        >
          {resetting ? 'Resetting...' : 'Reset Database'}
        </button>
      </div>
      {status && (
        <p style={{ marginTop: '1rem', color: status.success ? '#4ade80' : '#ff6b6b' }}>
          {status.message}
        </p>
      )}
    </div>
  )
}

export default Home
