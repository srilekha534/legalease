import { severityColor, severityIcon } from '../utils/helpers'

export default function RiskBadge({ severity }) {
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${severityColor(severity)}`}>
      {severityIcon(severity)} {severity?.toUpperCase()} RISK
    </span>
  )
}
