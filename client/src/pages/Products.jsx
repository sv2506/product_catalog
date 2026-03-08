import { useState, useEffect, useRef } from 'react'
import './Products.css'

const API = 'http://localhost:8000'

function Products() {
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ category: '', form: '', process: '', certification: '' })
  const [error, setError] = useState(null)
  const [hasData, setHasData] = useState(true)
  const [hasSearchedOrFiltered, setHasSearchedOrFiltered] = useState(false)
  const initialLoad = useRef(true)

  const buildParams = (searchVal, filterVals) => {
    const params = new URLSearchParams()
    if (searchVal) params.set('q', searchVal)
    if (filterVals.category) params.set('category', filterVals.category)
    if (filterVals.form) params.set('form', filterVals.form)
    if (filterVals.process) params.set('process', filterVals.process)
    if (filterVals.certification) params.set('certification', filterVals.certification)
    const str = params.toString()
    return str ? `?${str}` : ''
  }

  const fetchProducts = async (searchVal = '', filterVals = filters) => {
    setLoading(true)
    setError(null)
    try {
      const params = buildParams(searchVal, filterVals)
      const res = await fetch(`${API}/products${params}`)
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      setProducts(data)
      if (initialLoad.current) {
        setAllProducts(data)
        setHasData(data.length > 0)
        initialLoad.current = false
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setHasSearchedOrFiltered(true)
    fetchProducts(search, filters)
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setHasSearchedOrFiltered(true)
    fetchProducts(search, newFilters)
  }

  const clearAll = () => {
    setSearch('')
    setFilters({ category: '', form: '', process: '', certification: '' })
    setHasSearchedOrFiltered(false)
    fetchProducts('', { category: '', form: '', process: '', certification: '' })
  }

  // Derive unique filter options from the full product list
  const categories = [...new Set(allProducts.map((p) => p.category))].sort()
  const forms = [...new Set(allProducts.map((p) => p.details?.form).filter(Boolean))].sort()
  const processes = [...new Set(allProducts.map((p) => p.details?.process).filter(Boolean))].sort()
  const certifications = [
    ...new Set(
      allProducts.flatMap((p) =>
        (p.certifications || '').split(/[|;,]/).map((c) => c.trim()).filter(Boolean)
      )
    ),
  ].sort()

  return (
    <div className="page">
      <h1>Products</h1>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {hasData && (
        <div className="filter-bar">
          <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filters.form} onChange={(e) => handleFilterChange('form', e.target.value)}>
            <option value="">All Forms</option>
            {forms.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={filters.process} onChange={(e) => handleFilterChange('process', e.target.value)}>
            <option value="">All Processes</option>
            {processes.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filters.certification} onChange={(e) => handleFilterChange('certification', e.target.value)}>
            <option value="">All Certifications</option>
            {certifications.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {hasSearchedOrFiltered && (
            <button type="button" className="btn-clear" onClick={clearAll}>Clear</button>
          )}
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="product-grid">
          {products.length === 0 ? (
            hasData ? (
              <p className="no-results">No results found.</p>
            ) : (
              <p>No products in catalog. <a href="/">Ingest data from Home.</a></p>
            )
          ) : (
            products.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-card-header">
                  <span className="product-category">{p.category}</span>
                  <span className="product-id">{p.item_id}</span>
                </div>
                <h3>{p.listing}</h3>
                <div className="product-details">
                  <span>{p.details?.form}</span>
                  {p.details?.process && <span>{p.details.process}</span>}
                </div>
                <p className="product-certs">{p.certifications}</p>
                <div className="product-meta">
                  <span>{p.pricing}</span>
                  <span className="product-avail">{p.availability}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Products
