import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { authFetch } from '../utils/api'
import Sidebar from '../components/Sidebar'
import './PostPages.css'

function PostEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      alert('Please log in to continue.')
      navigate('/login')
      return
    }
    fetchPost()
  }, [id, navigate])

  const fetchPost = async () => {
    try {
      const data = await authFetch(`/posts/${id}/edit`)
      
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
      const data = await authFetch(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: formData.title,
          content: formData.content
        })
      })

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
