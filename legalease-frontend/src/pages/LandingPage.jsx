import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: '📄', title: 'Upload Any Legal Document', desc: 'Rental agreements, employment contracts, NDAs, Terms & Conditions, loan agreements — we handle them all.' },
  { icon: '🤖', title: 'AI-Powered Analysis', desc: 'Our AI reads the entire document and creates a plain-English summary anyone can understand in seconds.' },
  { icon: '🚨', title: 'Risk Clause Detection', desc: 'Automatically identifies risky or one-sided clauses and explains exactly what they mean for you.' },
  { icon: '🔑', title: 'Key Terms Extraction', desc: 'Instantly pulls out important details like deadlines, penalties, notice periods, and payment amounts.' },
  { icon: '📜', title: 'Document History', desc: 'All your analyzed documents are saved securely so you can revisit them anytime.' },
  { icon: '🔒', title: 'Private & Secure', desc: 'Your documents are processed securely. We never share or sell your data.' },
]

const steps = [
  { step: '01', title: 'Create Free Account', desc: 'Sign up in seconds — no credit card needed.' },
  { step: '02', title: 'Upload Your PDF', desc: 'Drag and drop your legal document into LegalEase.' },
  { step: '03', title: 'Get Instant Analysis', desc: 'Our AI analyzes it and gives you a complete, easy-to-read summary in under 30 seconds.' },
]

export default function LandingPage() {
  const { isLoggedIn } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span>⚡</span> AI-Powered Legal Document Analysis
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6">
            Understand Any Legal Document
            <span className="block text-blue-200"> in Plain English</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload any legal document and get an instant AI summary, risk analysis, and key terms — 
            without needing a lawyer or a law degree.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={isLoggedIn ? '/upload' : '/register'}
              className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-all shadow-lg"
            >
              {isLoggedIn ? 'Analyze a Document →' : 'Get Started Free →'}
            </Link>
            {!isLoggedIn && (
              <Link
                to="/login"
                className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all"
              >
                I already have an account
              </Link>
            )}
          </div>
          <p className="text-blue-200 text-sm mt-6">✅ Free to use &nbsp;&nbsp; ✅ No credit card &nbsp;&nbsp; ✅ Instant results</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg">Get your legal document analyzed in 3 simple steps</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white text-2xl font-black rounded-2xl flex items-center justify-center mx-auto mb-5">
                  {step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-500 text-lg">LegalEase gives you everything to understand your legal documents</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-amber-50 border-y border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-amber-800 text-sm">
            <strong>⚠️ Important Disclaimer:</strong> LegalEase provides AI-generated summaries for informational purposes only.
            This is not legal advice. Always consult a qualified lawyer before signing any legal document.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Understand Your Document?</h2>
          <p className="text-blue-200 text-lg mb-8">Join thousands of people who use LegalEase to protect themselves.</p>
          <Link
            to={isLoggedIn ? '/upload' : '/register'}
            className="bg-white text-blue-700 font-bold px-10 py-4 rounded-xl text-lg hover:bg-blue-50 transition-all shadow-lg inline-block"
          >
            {isLoggedIn ? 'Analyze a Document →' : 'Start for Free →'}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
