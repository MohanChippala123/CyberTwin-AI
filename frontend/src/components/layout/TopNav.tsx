import { Company } from '../../api/client'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface Props {
  company: Company
  onWhatIf: () => void
}

export default function TopNav({ company, onWhatIf }: Props) {
  const navigate = useNavigate()

  return (
    <div className="bg-cyber-surface border-b border-cyber-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-cyber-border rounded transition-colors"
          title="Back to home"
        >
          <ArrowLeft size={20} className="text-gray-400" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-cyan-400">{company.name}</h1>
          <p className="text-xs text-gray-400">{company.domain} · {company.industry} · {company.employee_count} employees</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-gray-400">Overall Risk Score</p>
          <p className={`text-2xl font-bold ${
            company.overall_risk_score >= 8 ? 'text-red-500' :
            company.overall_risk_score >= 6 ? 'text-amber-500' :
            company.overall_risk_score >= 3 ? 'text-blue-500' :
            'text-green-500'
          }`}>
            {company.overall_risk_score.toFixed(1)}
          </p>
        </div>

        <button
          onClick={onWhatIf}
          className="px-4 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700 transition-colors text-sm"
        >
          What-If Scenario
        </button>
      </div>
    </div>
  )
}
