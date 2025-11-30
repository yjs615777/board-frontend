import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PostListPage from './pages/PostListPage'
import PostCreatePage from './pages/PostCreatePage'
import PostDetailPage from './pages/PostDetailPage'
import PostEditPage from './pages/PostEditPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로는 로그인 페이지로 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* 게시판 페이지들 */}
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/posts/write" element={<PostCreatePage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/posts/:id/edit" element={<PostEditPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App