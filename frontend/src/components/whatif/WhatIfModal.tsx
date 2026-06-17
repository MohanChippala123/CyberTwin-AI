import { useState } from 'react'
import { Asset, client } from '../../api/client'
import { X } from 'lucide-react'

interface Props {
  companyId: string
  assets: Asset[]
  onClose: () => void
}

export default function WhatIfModal({ companyId, assets, onClose }: Props) {
  const [scenario, setScenario] = useState('admin_account_compromised')
  const [selectedAsset, setSelectedAsset] = useState(assets[0]?.id || '')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const scenarios = [
    { id: 'admin_account_compromised', name: 'Admin Account Compromised' },
    { id: 'api_breach', name: 'API Gateway Breached' },
    { id: 'database_exposed', name: 'Database Exposed' },
    { id: 'insider_threat', name: 'Insider Threat' },
    { id: 'supply_chain', name: 'Supply Chain Attack' },
  ]

  const handleSimulate = async () => {
    setLoading(true)
    try {
      const response = await client.runWhatIfSimulation(companyId, scenario, selectedAsset)
      setResult(response)
    } catch (error) {
      console.error('Simulation error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-cyber-surface border border-cyber-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-cyber-border flex justify-between items-center sticky top-0 bg-cyber-surface">
          <h2 className="text-2xl font-bold text-cyan-400">What-If Attack Simulator</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-cyber-border rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {!result ? (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Attack Scenario</label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="cyber-input w-full"
              >
                {scenarios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Affected Asset</label>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="cyber-input w-full"
              >
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.asset_type})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSimulate}
              disabled={loading}
              className="w-full py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Running Simulation...' : 'Run Simulation'}
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-cyan-400">{result.scenario_name}</h3>

            <div className="bg-cyber-bg p-4 rounded border border-cyber-border">
              <p className="text-sm text-gray-300">{result.executive_summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyber-bg p-4 rounded border border-cyber-border">
                <p className="text-xs text-gray-400 mb-2">New Risk Score</p>
                <p className={`text-3xl font-bold ${
                  result.new_risk_score >= 8 ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {result.new_risk_score?.toFixed(1)}
                </p>
              </div>

              <div className="bg-cyber-bg p-4 rounded border border-cyber-border">
                <p className="text-xs text-gray-400 mb-2">Impact</p>
                <p className="text-lg font-semibold text-gray-200">{result.estimated_financial_impact}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-300 mb-2">Blast Radius</p>
              <div className="space-y-2">
                {result.blast_radius?.compromised_immediately?.length > 0 && (
                  <div className="p-3 bg-red-900/30 border border-red-600 rounded text-sm">
                    <p className="font-semibold text-red-400">Compromised Immediately:</p>
                    <p className="text-red-300 text-xs">{result.blast_radius.compromised_immediately.join(', ')}</p>
                  </div>
                )}
                {result.blast_radius?.at_risk_within_24h?.length > 0 && (
                  <div className="p-3 bg-amber-900/30 border border-amber-600 rounded text-sm">
                    <p className="font-semibold text-amber-400">At Risk Within 24h:</p>
                    <p className="text-amber-300 text-xs">{result.blast_radius.at_risk_within_24h.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>

            {result.recommended_immediate_actions?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-300 mb-2">Recommended Actions</p>
                <ul className="space-y-1">
                  {result.recommended_immediate_actions.map((action: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-400">• {action}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setResult(null)}
                className="flex-1 py-2 bg-cyber-border text-white rounded font-medium hover:bg-gray-700 transition-colors"
              >
                Run Another
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-cyan-600 text-white rounded font-medium hover:bg-cyan-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
