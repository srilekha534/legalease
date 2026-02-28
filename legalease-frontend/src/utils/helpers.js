export const formatDate = (isoString) => {
  if (!isoString) return ''
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const docTypeLabel = (type) => {
  const map = {
    rental: 'Rental Agreement',
    employment: 'Employment Contract',
    nda: 'Non-Disclosure Agreement',
    terms: 'Terms & Conditions',
    loan: 'Loan Agreement',
    service: 'Service Agreement',
    other: 'Legal Document',
  }
  return map[type] || 'Legal Document'
}

export const docTypeColor = (type) => {
  const map = {
    rental: 'bg-purple-100 text-purple-700',
    employment: 'bg-blue-100 text-blue-700',
    nda: 'bg-orange-100 text-orange-700',
    terms: 'bg-gray-100 text-gray-700',
    loan: 'bg-red-100 text-red-700',
    service: 'bg-green-100 text-green-700',
    other: 'bg-slate-100 text-slate-700',
  }
  return map[type] || 'bg-slate-100 text-slate-700'
}

export const severityColor = (severity) => {
  const map = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200',
  }
  return map[severity] || 'bg-gray-100 text-gray-700 border-gray-200'
}

export const severityIcon = (severity) => {
  const map = { high: '🔴', medium: '🟡', low: '🟢' }
  return map[severity] || '⚪'
}
