import { Handle, Position } from '@xyflow/react'
import { Asset } from '../../api/client'
import { Shield, Server, Database, Lock, Cloud, Zap, Monitor, Users } from 'lucide-react'

const iconMap: { [key: string]: React.ReactNode } = {
  api: <Zap size={20} />,
  database: <Database size={20} />,
  server: <Server size={20} />,
  firewall: <Shield size={20} />,
  cloud: <Cloud size={20} />,
  endpoint: <Monitor size={20} />,
  user: <Users size={20} />,
  iot: <Zap size={20} />,
}

const colorMap: { [key: string]: string } = {
  critical: 'border-red-500 bg-red-900/30',
  warning: 'border-amber-500 bg-amber-900/30',
  moderate: 'border-blue-500 bg-blue-900/30',
  safe: 'border-green-500 bg-green-900/30',
}

export default function AssetNode({ data }: { data: { label: string; asset: Asset; onSelect: (asset: Asset) => void } }) {
  const { asset, onSelect } = data

  return (
    <div
      onClick={() => onSelect(asset)}
      className={`px-3 py-2 rounded-lg border-2 ${colorMap[asset.status] || colorMap.safe} cursor-pointer hover:shadow-lg hover:shadow-cyan-500/50 transition-shadow min-w-max`}
    >
      <Handle type="target" position={Position.Top} />

      <div className="flex items-center gap-2 mb-1">
        <div className="text-cyan-400">{iconMap[asset.asset_type] || iconMap.server}</div>
        <div className="text-xs font-bold text-white">{asset.name}</div>
      </div>

      <div className="text-xs text-gray-300 mb-1">{asset.asset_type}</div>
      <div className="text-xs font-semibold text-white">Risk: {asset.risk_score.toFixed(1)}/10</div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
