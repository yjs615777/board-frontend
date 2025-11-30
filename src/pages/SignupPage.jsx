import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AuthPages.css'

function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
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
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('Sign up successful! Please log in.')
        navigate('/login')
      } else {
        setError(data.message || 'Registration failed.')
      }
    } catch (err) {
      setError('Failed to connect to the server.')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-section">
        <div className="auth-form-wrapper">
          <h1 className="auth-title">Get Started Now</h1>
          
          {error && <div className="auth-error">{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

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
            Sign Up
          </button>

          <div className="auth-divider">
            <span>Or</span>
          </div>

          <p className="auth-switch">
            Have an account? <Link to="/login" className="auth-link">Sign In</Link>
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

export default SignupPage