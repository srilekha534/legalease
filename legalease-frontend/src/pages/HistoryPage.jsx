import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { getHistory, deleteDocument } from '../api/documentApi'
import { useAuth } from '../context/AuthContext'
import { formatDate, docTypeLabel, docTypeColor } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function HistoryPage() {
  const { isLoggedIn } = useAuth()
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  if (!isLoggedIn) return <Navigate to="/login" replace />

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory()
        setDocs(data.documents || [])
      } catch (err) {
        toast.error('Could not load your documents.')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const handleDelete = async (id, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) return
    setDeletingId(id)
    try {
      await deleteDocument(id)
      setDocs((prev) => prev.filter((d) => d.id !== id))
      toast.success('Document deleted.')
    } catch {
      toast.error('Could not delete document.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
              <p className="text-gray-500 mt-1">All your previously analyzed legal documents</p>
            </div>
            <Link to="/upload" className="btn-primary text-sm">
              + Analyze New Document
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading your documents..." />
          ) : docs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <span className="text-6xl">📂</span>
              <h2 className="text-2xl font-bold text-gray-700 mt-5 mb-2">No Documents Yet</h2>
              <p className="text-gray-400 mb-8">You haven't analyzed any legal documents yet. Upload your first one!</p>
              <Link to="/upload" className="btn-primary inline-block">
                Analyze Your First Document →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${docTypeColor(doc.documentType)}`}>
                          {docTypeLabel(doc.documentType)}
                        </span>
                        <span className="text-sm text-gray-400">{formatDate(doc.createdAt)}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 truncate mb-2">{doc.fileName}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{doc.summary}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link
                        to={`/result/${doc.id}`}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded-xl text-sm transition-colors"
                      >
                        View →
                      </Link>
                      <button
                        onClick={() => handleDelete(doc.id, doc.fileName)}
                        disabled={deletingId === doc.id}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50"
                      >
                        {deletingId === doc.id ? '...' : '🗑️'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
