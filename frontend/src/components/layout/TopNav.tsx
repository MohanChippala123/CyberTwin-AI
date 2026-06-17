import { Company } from '../../api/client'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

interface Props {
  company: Company
  onWhatIf: () => void
}

export default function TopNav({ company, onWhatIf }: Props) {
  const navigate = useNavigate()

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-[#f85149]'
    if (score >= 6) return 'text-[#d29922]'
    if (score >= 3) return 'text-[#1f6feb]'
    return 'text-[#238636]'
  }

  const getRiskBgColor = (score: number) => {
    if (score >= 8) return 'bg-[rgba(248,81,73,0.1)]'
    if (score >= 6) return 'bg-[rgba(210,153,34,0.1)]'
    if (score >= 3) return 'bg-[rgba(31,111,235,0.1)]'
    return 'bg-[rgba(35,134,54,0.1)]'
  }

  return (
    <div className="bg-[#0f1117] border-b border-[#30363d] px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => navigate('/')}
          className="p-1.5 hover:bg-[#161b22] rounded transition-colors text-[#6e7681]"
          title="Back"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="border-l border-[#30363d] pl-4">
          <h2 className="text-sm font-bold text-[#e6edf3]">{company.name}</h2>
          <p className="text-xs text-[#6e7681]">
            {company.domain} {company.industry ? `· ${company.industry}` : ''} {company.employee_count ? `· ${company.employee_count} employees` : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Risk score */}
        <div className={`px-3 py-1.5 rounded border ${getRiskBgColor(company.overall_risk_score)} border-[#30363d]`}>
          <p className="text-xs text-[#8b949e] font-medium">Risk Score</p>
          <p className={`text-lg font-bold ${getRiskColor(company.overall_risk_score)}`}>
            {company.overall_risk_score.toFixed(1)}/10
          </p>
        </div>

        {/* What-If button */}
        <button
          onClick={onWhatIf}
          className="btn-secondary text-sm"
        >
          Simulate Attack
        </button>
      </div>
    </div>
  )
}
