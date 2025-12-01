const API_BASE = 'https://api.js-board.online/api'

// 토큰 가져오기
const getToken = () => {
  const user = localStorage.getItem('user')
  if (user) {
    return JSON.parse(user).token
  }
  return null
}

// 인증이 필요한 API 호출
export const authFetch = async (url, options = {}) => {
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  })
  
  return response.json()
}

// 인증 불필요한 API 호출 (로그인, 회원가입)
export const publicFetch = async (url, options = {}) => {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  return response.json()
}