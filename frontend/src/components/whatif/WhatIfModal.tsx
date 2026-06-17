import { useState } from 'react'
import { Asset, client } from '../../api/client'
import { X, AlertTriangle } from 'lucide-react'

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
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        maxWidth: '640px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={20} style={{ color: 'var(--medium)' }} />
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Attack Simulation</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'var(--text-2)',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={18} />
          </button>
        </div>

        {!result ? (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ color: 'var(--text-2)', fontSize: '12px', margin: 0 }}>
              Simulate a realistic attack scenario to understand blast radius, impact, and affected assets.
            </p>

            <div>
              <label style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--text-3)',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: 'var(--mono)'
              }}>
                Attack Scenario
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {scenarios.map((s) => (
                  <label
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      borderRadius: '4px',
                      border: scenario === s.id ? '2px solid var(--accent)' : '2px solid var(--border)',
                      backgroundColor: scenario === s.id ? 'rgba(200, 245, 60, 0.05)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      if (scenario !== s.id) {
                        e.currentTarget.style.borderColor = 'var(--accent)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (scenario !== s.id) {
                        e.currentTarget.style.borderColor = 'var(--border)'
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="scenario"
                      value={s.id}
                      checked={scenario === s.id}
                      onChange={(e) => setScenario(e.target.value)}
                      style={{ marginRight: '12px', cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    <span style={{ color: 'var(--text)', fontWeight: 500, fontSize: '12px' }}>{s.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--text-3)',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: 'var(--mono)'
              }}>
                Initial Target
              </label>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                style={{
                  width: '100%',
                  fontFamily: 'var(--mono)',
                  fontSize: '12px',
                  backgroundColor: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.asset_type}) — Risk {asset.risk_score.toFixed(1)}/10
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSimulate}
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Running simulation...' : 'Run Simulation'}
            </button>
          </div>
        ) : (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px', margin: 0 }}>{result.scenario_name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-2)', margin: 0 }}>{result.executive_summary}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{
                backgroundColor: 'var(--bg)',
                padding: '16px',
                borderRadius: '4px',
                border: '1px solid var(--border)'
              }}>
                <p style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', margin: 0 }}>New Risk Score</p>
                <p style={{
                  fontSize: '28px',
                  fontWeight: 600,
                  color: result.new_risk_score >= 8 ? 'var(--high)' : result.new_risk_score >= 6 ? 'var(--medium)' : 'var(--low)',
                  fontFamily: 'var(--mono)',
                  margin: 0
                }}>
                  {result.new_risk_score?.toFixed(1)}
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--bg)',
                padding: '16px',
                borderRadius: '4px',
                border: '1px solid var(--border)'
              }}>
                <p style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', margin: 0 }}>Estimated Impact</p>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--mono)', margin: 0 }}>{result.estimated_financial_impact}</p>
              </div>
            </div>

            {result.blast_radius && (
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px', margin: 0 }}>Blast Radius</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {result.blast_radius?.compromised_immediately?.length > 0 && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '4px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <AlertTriangle size={14} style={{ color: 'var(--high)' }} />
                        <p style={{ fontWeight: 600, color: 'var(--high)', fontSize: '12px', margin: 0 }}>Compromised Immediately</p>
                      </div>
                      <p style={{ color: 'var(--text-2)', fontSize: '11px', margin: 0 }}>{result.blast_radius.compromised_immediately.join(', ')}</p>
                    </div>
                  )}
                  {result.blast_radius?.at_risk_within_24h?.length > 0 && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'rgba(249, 115, 22, 0.1)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                      borderRadius: '4px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <AlertTriangle size={14} style={{ color: 'var(--medium)' }} />
                        <p style={{ fontWeight: 600, color: 'var(--medium)', fontSize: '12px', margin: 0 }}>At Risk Within 24 Hours</p>
                      </div>
                      <p style={{ color: 'var(--text-2)', fontSize: '11px', margin: 0 }}>{result.blast_radius.at_risk_within_24h.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {result.recommended_immediate_actions?.length > 0 && (
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px', margin: 0 }}>Immediate Actions</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: 0, padding: 0, listStyle: 'none' }}>
                  {result.recommended_immediate_actions.map((action: string, idx: number) => (
                    <li key={idx} style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-2)' }}>
                      <span style={{ color: 'var(--clean)', flexShrink: 0 }}>✓</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setResult(null)}
                className="btn-secondary"
                style={{ flex: 1, fontSize: '12px' }}
              >
                Another Scenario
              </button>
              <button
                onClick={onClose}
                className="btn-primary"
                style={{ flex: 1, fontSize: '12px' }}
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
