import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './ProjectDetail.css'

const API = 'http://localhost:8000'

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`${API}/projects/${id}`)
      if (!res.ok) throw new Error('Project not found')
      setProject(await res.json())
    } catch (err) {
      setError(err.message)
    }
  }, [id])

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`)
      if (!res.ok) throw new Error('Failed to fetch products')
      setProducts(await res.json())
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    Promise.all([fetchProject(), fetchProducts()]).then(() => setLoading(false))
  }, [fetchProject])

  const addProduct = async (productId) => {
    setMessage(null)
    setError(null)
    try {
      const res = await fetch(`${API}/projects/${id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to add product')
      setMessage(data.message)
      await fetchProject()
    } catch (err) {
      setError(err.message)
    }
  }

  const removeProduct = async (productId) => {
    setMessage(null)
    setError(null)
    try {
      const res = await fetch(`${API}/projects/${id}/items/${productId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to remove product')
      setMessage(data.message)
      await fetchProject()
    } catch (err) {
      setError(err.message)
    }
  }

  const submitProject = async () => {
    setMessage(null)
    setError(null)
    try {
      const res = await fetch(`${API}/projects/${id}/submit`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to submit project')
      setMessage('Project submitted!')
      setProject(data)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="page"><p>Loading...</p></div>
  if (!project) return <div className="page"><p className="error">Project not found.</p></div>

  const projectProductIds = new Set(project.items.map((i) => i.product_id))
  const isDraft = project.status === 'draft'

  return (
    <div className="page">
      <button className="btn-back" onClick={() => navigate('/projects')}>&larr; All Projects</button>

      <div className="detail-header">
        <div>
          <h1>{project.name}</h1>
          <p className="detail-requester">{project.requester_name} ({project.requester_email})</p>
        </div>
        <span className={`status-badge status-${project.status}`}>{project.status}</span>
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <section className="detail-section">
        <h2>Project Items ({project.items.length})</h2>
        {project.items.length === 0 ? (
          <p className="muted">No products added yet.</p>
        ) : (
          <div className="item-list">
            {project.items.map((item) => {
              const product = products.find((p) => p.id === item.product_id)
              return (
                <div key={item.id} className="item-row">
                  <div>
                    <strong>{product ? product.listing : `Product #${item.product_id}`}</strong>
                    {product && <span className="item-category">{product.category}</span>}
                  </div>
                  {isDraft && (
                    <button className="btn-danger" onClick={() => removeProduct(item.product_id)}>
                      Remove
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {isDraft && project.items.length > 0 && (
          <button className="btn-submit" onClick={submitProject}>Submit Project</button>
        )}
      </section>

      {isDraft && (
        <section className="detail-section">
          <h2>Available Products</h2>
          {products.length === 0 ? (
            <p className="muted">No products in catalog. Ingest data first.</p>
          ) : (
            <div className="item-list">
              {products
                .filter((p) => !projectProductIds.has(p.id))
                .map((p) => (
                  <div key={p.id} className="item-row">
                    <div>
                      <strong>{p.listing}</strong>
                      <span className="item-category">{p.category}</span>
                    </div>
                    <button className="btn-primary btn-sm" onClick={() => addProduct(p.id)}>
                      + Add
                    </button>
                  </div>
                ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default ProjectDetail
