import { Asset, AttackPath } from '../../api/client'

interface Props {
  assets: Asset[]
  attackPaths: AttackPath[]
  onSelectAsset: (asset: Asset | null) => void
}

export default function AttackGraph({ assets, attackPaths, onSelectAsset }: Props) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#e8e6e0',
      fontFamily: 'monospace',
      fontSize: '14px',
      padding: '24px',
      overflow: 'auto'
    }}>
      <h2 style={{ margin: '0 0 24px 0', textAlign: 'center' }}>Attack Surface Map</h2>

      <div style={{ maxWidth: '100%' }}>
        <p style={{ color: '#8a8880', marginBottom: '24px', textAlign: 'center' }}>
          {assets.length} assets · {attackPaths.length} attack paths
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px', width: '100%' }}>
          {assets.map(asset => (
            <div
              key={asset.id}
              style={{
                padding: '16px',
                backgroundColor: '#111110',
                border: '1px solid #232320',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => onSelectAsset(asset)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#c8f53c'
                e.currentTarget.style.backgroundColor = '#1a1a18'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#232320'
                e.currentTarget.style.backgroundColor = '#111110'
              }}
            >
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#e8e6e0' }}>{asset.name}</p>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#8a8880' }}>{asset.asset_type}</p>
              <div style={{
                padding: '6px 10px',
                backgroundColor: asset.risk_score >= 8 ? 'rgba(239, 68, 68, 0.1)' : asset.risk_score >= 6 ? 'rgba(249, 115, 22, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                borderRadius: '3px',
                fontSize: '11px',
                color: asset.risk_score >= 8 ? '#ef4444' : asset.risk_score >= 6 ? '#f97316' : '#fbbf24',
                fontWeight: 'bold',
                textAlign: 'center',
                display: 'inline-block'
              }}>
                Risk: {asset.risk_score.toFixed(1)}/10
              </div>
            </div>
          ))}
        </div>

        {attackPaths.length > 0 && (
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #232320' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#e8e6e0' }}>Attack Paths ({attackPaths.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {attackPaths.slice(0, 5).map(path => (
                <div key={path.id} style={{ padding: '12px', backgroundColor: '#111110', border: '1px solid #232320', borderRadius: '4px' }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#e8e6e0', fontSize: '13px' }}>{path.name}</p>
                  <p style={{ margin: '0 0 8px 0', color: '#8a8880', fontSize: '12px', lineHeight: '1.4' }}>{path.description}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '3px 8px',
                      backgroundColor: path.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                      color: path.severity === 'critical' ? '#ef4444' : '#f97316',
                      borderRadius: '3px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {path.severity}
                    </span>
                    <span style={{ color: '#8a8880', fontSize: '10px' }}>
                      Likelihood: {(path.likelihood * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
              {attackPaths.length > 5 && (
                <p style={{ color: '#8a8880', fontSize: '12px', marginTop: '8px' }}>
                  +{attackPaths.length - 5} more attack paths
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
