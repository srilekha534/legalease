import { Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import UploadBox from '../components/UploadBox'
import { useAuth } from '../context/AuthContext'

export default function UploadPage() {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Analyze Your Legal Document
            </h1>
            <p className="text-gray-500 text-lg">
              Upload any PDF and get an instant AI-powered plain-English summary with risk analysis.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <UploadBox />
          </div>

          {/* Tips */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { icon: '✅', tip: 'Works best with text-based PDFs (not scanned images)' },
              { icon: '⚡', tip: 'Analysis takes 15–30 seconds depending on document length' },
              { icon: '🔒', tip: 'Your document is processed securely and never shared' },
            ].map(({ icon, tip }) => (
              <div key={tip} className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
                <span className="text-xl">{icon}</span>
                <p className="text-sm text-blue-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
