import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import './PostPages.css'

function PostEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      alert('Please log in to continue.')
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchPost()
  }, [id, navigate])

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${id}`)
      const data = await response.json()
      
      if (data.success) {
        setFormData({
          title: data.data.title,
          content: data.data.content
        })
      }
    } catch (err) {
      console.error('Failed to load the post:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      alert('Please enter a title and content.')
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${id}?userId=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('The post has been updated.')
        navigate(`/posts/${id}`)
      } else {
        alert(data.message || 'Failed to update the post.')
      }
    } catch (err) {
      alert('Failed to connect to the server.')
    }
  }

  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <div className="post-form">
          <label className="form-label-dark">Title</label>
          <input
            type="text"
            name="title"
            className="form-input-box"
            value={formData.title}
            onChange={handleChange}
          />

          <label className="form-label-dark">Content</label>
          <textarea
            name="content"
            className="form-textarea"
            value={formData.content}
            onChange={handleChange}
          />

          <div className="form-actions">
            <button className="create-btn" onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PostEditPage
