import { Company, Asset } from '../../api/client'
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts'

interface Props {
  company: Company
  selectedAsset: Asset | null
  onAssetClick: (asset: Asset) => void
}

export default function RiskScorePanel({ company, selectedAsset, onAssetClick }: Props) {
  const riskData = [{ name: 'Risk', value: company.overall_risk_score, fill: company.overall_risk_score >= 8 ? '#ff2d55' : company.overall_risk_score >= 6 ? '#ffb700' : '#00ff9f' }]

  return (
    <div className="p-4 h-full overflow-y-auto flex flex-col">
      <h2 className="text-lg font-bold text-cyan-400 mb-4">Security Score</h2>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart data={riskData} innerRadius="70%" outerRadius="100%">
            <PolarAngleAxis type="number" domain={[0, 10]} angleAxisId={0} />
            <RadialBar angleAxisId={0} dataKey="value" cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="text-center">
          <p className="text-3xl font-bold text-white">{company.overall_risk_score.toFixed(1)}</p>
          <p className="text-xs text-gray-400">out of 10.0</p>
        </div>
      </div>

      <div className="border-t border-cyber-border pt-4 mb-4">
        <h3 className="text-sm font-bold text-gray-300 mb-2">Top Assets by Risk</h3>
        <div className="space-y-2">
          {(company.assets || [])
            .sort((a, b) => b.risk_score - a.risk_score)
            .slice(0, 5)
            .map((asset) => (
              <button
                key={asset.id}
                onClick={() => onAssetClick(asset)}
                className={`w-full text-left p-2 rounded text-xs border transition-colors ${
                  selectedAsset?.id === asset.id
                    ? 'bg-cyan-900 border-cyan-500 text-cyan-300'
                    : `border-${asset.risk_score >= 8 ? 'red-500' : asset.risk_score >= 6 ? 'amber-500' : 'gray-600'} hover:bg-gray-800`
                }`}
              >
                <div className="font-semibold text-white truncate">{asset.name}</div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{asset.asset_type}</span>
                  <span className="font-bold text-white">{asset.risk_score.toFixed(1)}</span>
                </div>
              </button>
            ))}
        </div>
      </div>

      {selectedAsset && (
        <div className="border-t border-cyber-border pt-4">
          <h3 className="text-sm font-bold text-gray-300 mb-2">Selected Asset</h3>
          <div className="bg-cyber-bg p-3 rounded text-xs space-y-1">
            <p>
              <span className="text-gray-500">Name:</span> <span className="text-white font-semibold">{selectedAsset.name}</span>
            </p>
            <p>
              <span className="text-gray-500">Type:</span> <span className="text-cyan-400">{selectedAsset.asset_type}</span>
            </p>
            <p>
              <span className="text-gray-500">Risk:</span> <span className="text-white font-semibold">{selectedAsset.risk_score.toFixed(1)}/10</span>
            </p>
            <p>
              <span className="text-gray-500">Status:</span> <span className={selectedAsset.status === 'critical' ? 'text-red-400' : selectedAsset.status === 'warning' ? 'text-amber-400' : 'text-green-400'}>{selectedAsset.status}</span>
            </p>
            {selectedAsset.cve_ids.length > 0 && <p>
              <span className="text-gray-500">CVEs:</span> <span className="text-red-400">{selectedAsset.cve_ids.join(', ')}</span>
            </p>}
          </div>
        </div>
      )}
    </div>
  )
}
