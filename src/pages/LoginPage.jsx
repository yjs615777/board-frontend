import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { publicFetch } from '../utils/api'
import './AuthPages.css'

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    setError('')
    // 유효성 검사
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      const data = await publicFetch('/users/login', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      if (data.success) {
        // 토큰 포함해서 저장
        localStorage.setItem('user', JSON.stringify(data.data))
        alert(`${data.data.username} Welcome!`)
        navigate('/posts') // 게시글 목록으로 이동
      } else {
        setError(data.message || 'Login failed.')
      }
    } catch (err) {
      setError('Failed to connect to the server.')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-section">
        <div className="auth-form-wrapper">
          <h1 className="auth-title">Welcome Back</h1>
          
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button className="auth-button" onClick={handleSubmit}>
            Sign In
          </button>

          <div className="auth-divider">
            <span>Or</span>
          </div>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
          </p>
        </div>
      </div>

      <div className="auth-image-section">
        <img 
          src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80" 
          alt="Plant" 
          className="auth-image"
        />
      </div>
    </div>
  )
}

export default LoginPage