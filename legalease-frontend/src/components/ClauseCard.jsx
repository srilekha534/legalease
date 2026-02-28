import RiskBadge from './RiskBadge'

export default function ClauseCard({ clause, explanation, severity, index }) {
  return (
    <div className={`rounded-xl border p-5 ${
      severity === 'high' ? 'border-red-200 bg-red-50' :
      severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
      'border-green-200 bg-green-50'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-sm font-semibold text-gray-500">Clause #{index + 1}</span>
        <RiskBadge severity={severity} />
      </div>
      <p className="text-gray-800 font-medium mb-2 text-sm leading-relaxed">
        "{clause}"
      </p>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">What this means for you:</p>
        <p className="text-gray-700 text-sm leading-relaxed">{explanation}</p>
      </div>
    </div>
  )
}
