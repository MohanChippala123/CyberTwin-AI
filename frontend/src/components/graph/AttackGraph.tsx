import { useCallback, useMemo } from 'react'
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, Node, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import AssetNode from './AssetNode'
import { Asset, AttackPath } from '../../api/client'

const nodeTypes = {
  asset: AssetNode,
}

interface Props {
  assets: Asset[]
  attackPaths: AttackPath[]
  onSelectAsset: (asset: Asset | null) => void
}

export default function AttackGraph({ assets, attackPaths, onSelectAsset }: Props) {
  const nodes: Node[] = useMemo(
    () =>
      assets.map((asset) => ({
        id: asset.id,
        data: { label: asset.name, asset, onSelect: onSelectAsset },
        position: { x: asset.pos_x || Math.random() * 600, y: asset.pos_y || Math.random() * 400 },
        type: 'asset',
      })),
    [assets, onSelectAsset]
  )

  const edges: Edge[] = useMemo(
    () =>
      attackPaths
        .filter((path) => path.source_asset_id && path.target_asset_id)
        .flatMap((path, idx) =>
          path.steps.map((_, stepIdx) => ({
            id: `${path.id}-${stepIdx}`,
            source: stepIdx === 0 ? path.source_asset_id : assets[stepIdx - 1]?.id || path.source_asset_id,
            target: stepIdx === path.steps.length - 1 ? path.target_asset_id : assets[stepIdx]?.id || path.target_asset_id,
            animated: true,
            style: {
              stroke: path.severity === 'critical' ? '#ff2d55' : path.severity === 'high' ? '#ffb700' : '#00d4ff',
              strokeWidth: 2,
              strokeDasharray: '5,5',
            },
            label: path.severity,
          }))
        ),
    [attackPaths, assets]
  )

  const [nodeState, setNodes, onNodesChange] = useNodesState(nodes)
  const [edgeState, setEdges, onEdgesChange] = useEdgesState(edges)

  return (
    <div className="w-full h-full">
      <ReactFlow nodes={nodeState} edges={edgeState} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}>
        <Background color="#1e2d4a" gap={12} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
