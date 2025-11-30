import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import './PostPages.css'

function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
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
    fetchComments()
  }, [id, navigate])

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${id}`)
      const data = await response.json()
      
      if (data.success) {
        setPost(data.data)
      }
    } catch (err) {
      console.error('Failed to load the post.', err)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${id}/comments`)
      const data = await response.json()
      
      if (data.success) {
        setComments(data.data)
      }
    } catch (err) {
      console.error('Failed to load the comments.', err)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const today = new Date()
  
  const isToday = 
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  
  if (isToday) {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
}

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const handleEdit = () => {
    navigate(`/posts/${id}/edit`)
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${id}?userId=${user.id}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        alert('The post has been deleted.')
        navigate('/posts')
      } else {
        alert(data.message || 'Failed to delete the post.')
      }
    } catch (err) {
      alert('Failed to connect to the server.')
    }
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert('Please enter a comment.')
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${id}/comments?userId=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment
        })
      })

      const data = await response.json()

      if (data.success) {
        setNewComment('')
        fetchComments()
      } else {
        alert(data.message || 'Failed to create the comment.')
      }
    } catch (err) {
      alert('Failed to connect to the server.')
    }
  }

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${id}/comments/${commentId}?userId=${user.id}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        fetchComments()
      } else {
        alert(data.message || 'Failed to delete the comment.')
      }
    } catch (err) {
      alert('Failed to connect to the server.')
    }
  }

  const isAuthor = post && user && post.authorName === user.username

  if (!post) {
    return (
      <div className="page-container">
        <Sidebar />
        <main className="main-content">
          <p>Loading...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <div className="post-detail">
          <div className="detail-header">
            <label className="form-label-dark">Title</label>
            <div className="detail-meta">
              <span>{post.authorName}</span>
              <span>{formatDate(post.createdAt)}</span>
              <span>{post.viewCount}</span>
            </div>
          </div>
          <div className="detail-title-box">{post.title}</div>

          <label className="form-label-dark">Content</label>
          <div className="detail-content-box">{post.content}</div>

          {isAuthor && (
            <div className="detail-actions">
              <button className="edit-btn" onClick={handleEdit}>Edit</button>
              <button className="delete-btn" onClick={handleDelete}>Delete</button>
            </div>
          )}

          <div className="comments-section">
            <label className="form-label-dark">Comments</label>
            
            {comments.length > 0 && (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <span className="comment-author">{comment.authorName}</span>
                    <span className="comment-content">{comment.content}</span>
                    <span className="comment-date">
                      {formatDate(comment.createdAt) || formatTime(comment.createdAt)}
                    </span>
                    {user && comment.authorName === user.username && (
                      <button 
                        className="comment-delete-btn"
                        onClick={() => handleCommentDelete(comment.id)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <textarea
              className="comment-input"
              placeholder=""
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <div className="form-actions">
              <button className="create-btn" onClick={handleCommentSubmit}>
                Create
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PostDetailPage
