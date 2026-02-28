import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UploadPage from './pages/UploadPage'
import ResultPage from './pages/ResultPage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/result/:id" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          {/* 404 fallback */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
              <span className="text-6xl">😕</span>
              <h1 className="text-2xl font-bold text-gray-700">Page Not Found</h1>
              <a href="/" className="text-blue-600 hover:underline font-medium">Go Home</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
