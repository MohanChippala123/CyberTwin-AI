import { Company, Asset } from '../../api/client'
import { AlertCircle } from 'lucide-react'

interface Props {
  company: Company
  selectedAsset: Asset | null
  onAssetClick: (asset: Asset) => void
  assets?: Asset[]
}

export default function RiskScorePanel({ company, selectedAsset, onAssetClick, assets = [] }: Props) {
  const getRiskColor = (score: number) => {
    if (score >= 8) return 'var(--high)'
    if (score >= 6) return 'var(--medium)'
    if (score >= 3) return 'var(--low)'
    return 'var(--clean)'
  }

  const getRiskStatus = (score: number) => {
    if (score >= 8) return 'CRITICAL'
    if (score >= 6) return 'HIGH'
    if (score >= 3) return 'MEDIUM'
    return 'LOW'
  }

  const getSeverityBg = (score: number) => {
    if (score >= 8) return 'rgba(239, 68, 68, 0.1)'
    if (score >= 6) return 'rgba(249, 115, 22, 0.1)'
    if (score >= 3) return 'rgba(251, 191, 36, 0.1)'
    return 'rgba(74, 222, 128, 0.1)'
  }

  const getSeverityBorder = (score: number) => {
    if (score >= 8) return 'rgba(239, 68, 68, 0.2)'
    if (score >= 6) return 'rgba(249, 115, 22, 0.2)'
    if (score >= 3) return 'rgba(251, 191, 36, 0.2)'
    return 'rgba(74, 222, 128, 0.2)'
  }

  return (
    <div style={{
      padding: '48px 32px',
      height: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--surface)'
    }}>
      <div style={{ marginBottom: '48px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--text-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '16px',
          fontFamily: 'var(--mono)'
        }}>
          <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
          Overall Risk Score
        </div>

        <div style={{
          padding: '16px',
          borderRadius: '4px',
          border: `1px solid ${getSeverityBorder(company.overall_risk_score)}`,
          backgroundColor: getSeverityBg(company.overall_risk_score)
        }}>
          <div style={{
            fontSize: '32px',
            fontFamily: 'var(--mono)',
            fontWeight: 600,
            marginBottom: '4px',
            color: getRiskColor(company.overall_risk_score)
          }}>
            {company.overall_risk_score.toFixed(1)}
          </div>
          <div style={{ fontSize: '11px', color: getRiskColor(company.overall_risk_score) }}>
            {getRiskStatus(company.overall_risk_score)} RISK
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg)',
        borderRadius: '4px',
        padding: '24px',
        marginBottom: '48px',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        fontSize: '11px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--high)', flexShrink: 0 }}></div>
          <span style={{ color: 'var(--text-2)' }}>8-10: Critical</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--medium)', flexShrink: 0 }}></div>
          <span style={{ color: 'var(--text-2)' }}>6-8: High</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--low)', flexShrink: 0 }}></div>
          <span style={{ color: 'var(--text-2)' }}>3-6: Medium</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--clean)', flexShrink: 0 }}></div>
          <span style={{ color: 'var(--text-2)' }}>0-3: Low</span>
        </div>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <h3 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--text)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '20px',
          fontFamily: 'var(--mono)',
          margin: 0
        }}>
          <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
          Critical Assets
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {assets
            .sort((a, b) => b.risk_score - a.risk_score)
            .slice(0, 5)
            .map((asset) => (
              <button
                key={asset.id}
                onClick={() => onAssetClick(asset)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 16px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  transition: 'all 0.15s',
                  border: selectedAsset?.id === asset.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                  backgroundColor: selectedAsset?.id === asset.id ? 'var(--surface-2)' : 'transparent',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (selectedAsset?.id !== asset.id) {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.backgroundColor = 'var(--surface-2)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAsset?.id !== asset.id) {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{asset.name}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, marginLeft: '8px', flexShrink: 0, color: getRiskColor(asset.risk_score) }}>
                    {asset.risk_score.toFixed(1)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-2)' }}>
                  <span style={{ fontSize: '10px' }}>{asset.asset_type}</span>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    backgroundColor: getSeverityBg(asset.risk_score),
                    color: getRiskColor(asset.risk_score)
                  }}>
                    {getRiskStatus(asset.risk_score)}
                  </span>
                </div>
              </button>
            ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', marginBottom: '32px' }}>
        <h3 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--text)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '20px',
          fontFamily: 'var(--mono)',
          margin: 0
        }}>
          <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
          Recommended Actions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <AlertCircle size={12} style={{ color: 'var(--medium)', flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-2)' }}>Run attack simulation to understand blast radius</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <AlertCircle size={12} style={{ color: 'var(--low)', flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-2)' }}>Review high-risk assets and dependencies</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <AlertCircle size={12} style={{ color: 'var(--clean)', flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-2)' }}>Chat with AI analyst for remediation guidance</span>
          </div>
        </div>
      </div>

      {selectedAsset && (
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '40px', paddingTop: '40px' }}>
          <h3 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--text)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '20px',
            fontFamily: 'var(--mono)',
            margin: 0
          }}>
            <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
            Asset Details
          </h3>
          <div style={{
            backgroundColor: 'var(--bg)',
            padding: '24px',
            borderRadius: '4px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            fontSize: '11px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-3)' }}>Name</span>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{selectedAsset.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-3)' }}>Type</span>
              <span style={{ color: 'var(--low)', fontFamily: 'var(--mono)' }}>{selectedAsset.asset_type}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-3)' }}>Risk Score</span>
              <span style={{ fontWeight: 600, fontFamily: 'var(--mono)', color: getRiskColor(selectedAsset.risk_score) }}>
                {selectedAsset.risk_score.toFixed(1)}/10
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-3)' }}>Status</span>
              <span style={{ color: getRiskColor(selectedAsset.risk_score), fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}>
                {getRiskStatus(selectedAsset.risk_score)}
              </span>
            </div>
            {selectedAsset.cve_ids.length > 0 && (
              <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-3)', marginBottom: '4px', margin: 0 }}>CVEs</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {selectedAsset.cve_ids.slice(0, 3).map((cve, idx) => (
                    <span key={idx} style={{
                      color: 'var(--high)',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '2px',
                      fontSize: '10px',
                      fontFamily: 'var(--mono)'
                    }}>
                      {cve}
                    </span>
                  ))}
                  {selectedAsset.cve_ids.length > 3 && (
                    <span style={{ color: 'var(--text-2)', fontSize: '10px', padding: '2px 8px' }}>+{selectedAsset.cve_ids.length - 3}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
