import { Handle, Position } from '@xyflow/react'
import { Asset } from '../../api/client'
import { AlertTriangle, Server, Database, Lock, Cloud, Zap, Monitor, Users } from 'lucide-react'

const iconMap: { [key: string]: React.ReactNode } = {
  api: <Zap size={16} />,
  database: <Database size={16} />,
  server: <Server size={16} />,
  firewall: <Lock size={16} />,
  cloud: <Cloud size={16} />,
  endpoint: <Monitor size={16} />,
  user: <Users size={16} />,
  iot: <AlertTriangle size={16} />,
}

const colorMap: { [key: string]: { border: string; bg: string; text: string } } = {
  critical: { border: '1px solid #ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'color: #ef4444' },
  warning: { border: '1px solid #f97316', bg: 'rgba(249, 115, 22, 0.1)', text: 'color: #f97316' },
  moderate: { border: '1px solid #fbbf24', bg: 'rgba(251, 191, 36, 0.1)', text: 'color: #fbbf24' },
  safe: { border: '1px solid #4ade80', bg: 'rgba(74, 222, 128, 0.1)', text: 'color: #4ade80' },
}

export default function AssetNode({ data }: { data: { label: string; asset: Asset; onSelect: (asset: Asset) => void } }) {
  const { asset, onSelect } = data
  const colorScheme = colorMap[asset.status] || colorMap.safe

  return (
    <div
      onClick={() => onSelect(asset)}
      style={{
        padding: '8px 12px',
        borderRadius: '4px',
        border: colorScheme.border,
        backgroundColor: colorScheme.bg,
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
        minWidth: 'max-content'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.15)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <Handle type="target" position={Position.Top} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
        <div style={colorScheme.text as any}>{iconMap[asset.asset_type] || iconMap.server}</div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{asset.name}</div>
      </div>

      <div style={{ fontSize: '11px', color: 'var(--text-2)', marginBottom: '4px' }}>{asset.asset_type}</div>
      <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', fontWeight: 600, ...colorScheme.text }}>Risk: {asset.risk_score.toFixed(1)}/10</div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
