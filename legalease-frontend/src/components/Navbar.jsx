import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">⚖️</span>
          <span className="text-xl font-bold text-blue-700">LegalEase</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                to="/upload"
                className="hidden sm:block text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Analyze Document
              </Link>
              <Link
                to="/history"
                className="hidden sm:block text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                My Documents
              </Link>
              <div className="flex items-center gap-2 ml-2">
                <span className="hidden sm:block text-sm text-gray-500">Hi, {user?.name?.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
