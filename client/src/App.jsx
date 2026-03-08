import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Products from './pages/Products'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Demo from './pages/Demo'
import './App.css'

function App() {
  return (
    <div className="app-layout">
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/demo" element={<Demo />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
