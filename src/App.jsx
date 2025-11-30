import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로는 로그인 페이지로 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* 나중에 추가할 페이지들 */}
        {/* <Route path="/posts" element={<PostListPage />} /> */}
        {/* <Route path="/posts/:id" element={<PostDetailPage />} /> */}
        {/* <Route path="/posts/write" element={<PostWritePage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App












