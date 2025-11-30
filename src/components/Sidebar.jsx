import { Link, useNavigate } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    alert('Logged out successfully.')
    navigate('/login')
  }

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <Link to="/posts" className="sidebar-link">Home</Link>
        <button onClick={handleLogout} className="sidebar-link sidebar-logout">
          Log out
        </button>
      </nav>
    </div>
  )
}

export default Sidebar