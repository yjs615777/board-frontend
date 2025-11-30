import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import './PostPages.css'

function PostListPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    // 로그인 체크
    const user = localStorage.getItem('user')
    if (!user) {
      alert('Please log in to continue.')
      navigate('/login')
      return
    }

    fetchPosts(currentPage)
  }, [currentPage, navigate])

  const fetchPosts = async (page) => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts?page=${page}&size=5`)
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.data.content)
        setTotalPages(data.data.totalPages)
      }
    } catch (err) {
      console.error('Failed to load the post.', err)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
  const today = new Date()
  
  // 오늘인지 확인 (년/월/일 비교)
  const isToday = 
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  
  if (isToday) {
    // 오늘이면 시간 표시 (16:23)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  } else {
    // 오늘 아니면 월/일 표시 (11/30)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
}

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`)
  }

  const renderPagination = () => {
    const pages = []
    for (let i = 0; i < totalPages && i < 5; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </button>
      )
    }
    if (totalPages > 5) {
      pages.push(<span key="ellipsis" className="pagination-ellipsis">...</span>)
    }
    return pages
  }

  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <div className="post-list">
          {posts.length === 0 ? (
            <p className="no-posts">No posts available.</p>
          ) : (
            posts.map((post) => (
              <div 
                key={post.id} 
                className="post-card"
                onClick={() => handlePostClick(post.id)}
              >
                <h3 className="post-card-title">{post.title}</h3>
                <div className="post-card-meta">
                  <span className="post-author">{post.authorName}</span>
                  <span className="post-date">{formatDate(post.createdAt)}</span>
                  <span className="post-views">{post.viewCount}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="list-footer">
          <div className="pagination">
            {renderPagination()}
          </div>
          <button 
            className="create-btn"
            onClick={() => navigate('/posts/write')}
          >
            Create
          </button>
        </div>
      </main>
    </div>
  )
}

export default PostListPage