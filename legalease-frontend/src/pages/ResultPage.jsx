import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import ClauseCard from '../components/ClauseCard'
import RiskBadge from '../components/RiskBadge'
import { getDocument } from '../api/documentApi'
import { useAuth } from '../context/AuthContext'
import { formatDate, docTypeLabel, docTypeColor } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function ResultPage() {
  const { id } = useParams()
  const { isLoggedIn } = useAuth()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('summary')

  if (!isLoggedIn) return <Navigate to="/login" replace />

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const data = await getDocument(id)
        setDoc(data)
      } catch (err) {
        toast.error('Could not load document. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchDoc()
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Loader message="Loading your analysis..." />
      <Footer />
    </div>
  )

  if (!doc) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <span className="text-5xl">😕</span>
        <h2 className="text-xl font-bold text-gray-700">Document not found</h2>
        <Link to="/upload" className="btn-primary">Analyze a New Document</Link>
      </div>
      <Footer />
    </div>
  )

  const highRisk = doc.riskClauses?.filter(c => c.severity === 'high') || []
  const mediumRisk = doc.riskClauses?.filter(c => c.severity === 'medium') || []
  const lowRisk = doc.riskClauses?.filter(c => c.severity === 'low') || []

  const tabs = [
    { id: 'summary', label: '📋 Summary' },
    { id: 'risks', label: `🚨 Risk Clauses (${doc.riskClauses?.length || 0})` },
    { id: 'terms', label: `🔑 Key Terms (${doc.keyTerms?.length || 0})` },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${docTypeColor(doc.documentType)}`}>
                    {docTypeLabel(doc.documentType)}
                  </span>
                  <span className="text-sm text-gray-400">{formatDate(doc.createdAt)}</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 break-all">{doc.fileName}</h1>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link to="/upload" className="btn-secondary text-sm px-4 py-2">
                  + New Analysis
                </Link>
                <Link to="/history" className="btn-secondary text-sm px-4 py-2">
                  My Documents
                </Link>
              </div>
            </div>

            {/* Risk summary badges */}
            <div className="flex gap-3 mt-5 flex-wrap">
              {highRisk.length > 0 && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2 rounded-xl">
                  <span className="text-red-500 font-bold text-lg">{highRisk.length}</span>
                  <span className="text-red-600 text-sm font-medium">High Risk Clauses</span>
                </div>
              )}
              {mediumRisk.length > 0 && (
                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 px-4 py-2 rounded-xl">
                  <span className="text-yellow-600 font-bold text-lg">{mediumRisk.length}</span>
                  <span className="text-yellow-700 text-sm font-medium">Medium Risk Clauses</span>
                </div>
              )}
              {lowRisk.length > 0 && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-2 rounded-xl">
                  <span className="text-green-600 font-bold text-lg">{lowRisk.length}</span>
                  <span className="text-green-700 text-sm font-medium">Low Risk Clauses</span>
                </div>
              )}
              {doc.riskClauses?.length === 0 && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-2 rounded-xl">
                  <span className="text-green-600 font-bold">✅</span>
                  <span className="text-green-700 text-sm font-medium">No major risks detected</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-white rounded-2xl border border-gray-100 p-1 shadow-sm">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'summary' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Document Summary</h2>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <p className="text-gray-700 leading-relaxed text-base">{doc.summary}</p>
              </div>
              <div className="mt-5 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-amber-800 text-sm">
                  <strong>⚠️ Reminder:</strong> This summary is AI-generated for informational purposes only. 
                  Always consult a qualified lawyer before signing any legal document.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-4">
              {doc.riskClauses?.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                  <span className="text-5xl">✅</span>
                  <h3 className="text-xl font-bold text-gray-700 mt-4">No Major Risk Clauses Detected</h3>
                  <p className="text-gray-400 mt-2">This document appears to be relatively standard. Still, consult a lawyer if unsure.</p>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <p className="text-sm text-gray-500">
                      🔍 Found <strong>{doc.riskClauses.length} clauses</strong> that need your attention. 
                      Review each carefully before signing.
                    </p>
                  </div>
                  {doc.riskClauses.map((clause, i) => (
                    <ClauseCard key={i} {...clause} index={i} />
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">🔑 Key Terms & Details</h2>
              {doc.keyTerms?.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl">📭</span>
                  <p className="text-gray-400 mt-3">No key terms were extracted from this document.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {doc.keyTerms.map(({ term, value }, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{term}</p>
                      </div>
                      <p className="text-gray-900 font-semibold text-right">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
