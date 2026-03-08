import { useState } from 'react'
import './Demo.css'

const API = 'http://localhost:8000'

function Demo() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const runDemo = async () => {
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const res = await fetch(`${API}/test/demo`, { method: 'POST' })
      if (!res.ok) throw new Error('Demo request failed')
      const data = await res.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1>Demo</h1>
      <p>Run the full end-to-end workflow in a single request.</p>
      <button className="demo-btn" onClick={runDemo} disabled={loading}>
        {loading ? 'Running...' : 'Run Demo'}
      </button>

      {error && <p className="error">{error}</p>}

      {results && (
        <div className="demo-results">
          {Object.entries(results).map(([step, data]) => (
            <div key={step} className="demo-step">
              <h3>{step.replace(/_/g, ' ')}</h3>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Demo
