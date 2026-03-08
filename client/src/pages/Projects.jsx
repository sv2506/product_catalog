import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Projects.css'

const API = 'http://localhost:8000'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', requester_name: '', requester_email: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/projects`)
      if (!res.ok) throw new Error('Failed to fetch projects')
      setProjects(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch(`${API}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Failed to create project')
      }
      const project = await res.json()
      setForm({ name: '', requester_name: '', requester_email: '' })
      setShowForm(false)
      navigate(`/projects/${project.id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <div className="projects-header">
        <h1>Projects</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ New Project</button>
      </div>

      {error && <p className="error">{error}</p>}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Project</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>&times;</button>
            </div>
            <form className="project-form" onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="Project name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                autoFocus
              />
              <input
                type="text"
                placeholder="Requester name"
                value={form.requester_name}
                onChange={(e) => setForm({ ...form, requester_name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Requester email"
                value={form.requester_email}
                onChange={(e) => setForm({ ...form, requester_email: e.target.value })}
                required
              />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}

      {!loading && projects.length === 0 && !showForm && (
        <p>No projects yet. Create one to get started.</p>
      )}

      {!loading && projects.length > 0 && (
        <div className="project-list">
          {projects.map((p) => (
            <div
              key={p.id}
              className="project-card"
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              <div className="project-card-header">
                <h3>{p.name}</h3>
                <span className={`status-badge status-${p.status}`}>{p.status}</span>
              </div>
              <p className="project-requester">{p.requester_name} ({p.requester_email})</p>
              <div className="project-card-meta">
                <span>{p.items.length} item{p.items.length !== 1 ? 's' : ''}</span>
                <span>{new Date(p.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects
