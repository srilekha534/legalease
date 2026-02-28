export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          <span className="font-bold text-blue-700">LegalEase</span>
        </div>
        <p className="text-sm text-gray-400 text-center">
          ⚠️ LegalEase provides summaries for informational purposes only. Always consult a qualified lawyer for legal advice.
        </p>
        <p className="text-sm text-gray-400">© 2025 LegalEase</p>
      </div>
    </footer>
  )
}
