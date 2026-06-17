import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { client, Asset, AttackPath } from '../api/client'
import AttackGraph from '../components/graph/AttackGraph'
import RiskScorePanel from '../components/panels/RiskScorePanel'
import SOCChatPanel from '../components/chat/SOCChatPanel'
import WhatIfModal from '../components/whatif/WhatIfModal'
import TopNav from '../components/layout/TopNav'

export default function DashboardPage() {
  const { companyId } = useParams<{ companyId: string }>()
  const { currentCompany, setCurrentCompany, setAssets, setAttackPaths, setLoading, loading } = useStore()
  const [showWhatIf, setShowWhatIf] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  useEffect(() => {
    if (!companyId) return

    const loadData = async () => {
      setLoading(true)
      try {
        const company = await client.getCompany(companyId)
        setCurrentCompany(company)

        const assetsData = await client.getCompanyAssets(companyId)
        setAssets(assetsData)

        const attackPathsData = await client.getAttackPaths(companyId)
        setAttackPaths(attackPathsData.attack_paths || [])
      } catch (error) {
        console.error('Failed to load dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [companyId, setCurrentCompany, setAssets, setAttackPaths, setLoading])

  if (loading || !currentCompany) {
    return (
      <div className="w-full h-screen bg-cyber-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading digital twin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-cyber-bg flex flex-col">
      <TopNav company={currentCompany} onWhatIf={() => setShowWhatIf(true)} />

      <div className="flex-1 flex gap-2 p-2 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-cyber-surface rounded border border-cyber-border overflow-hidden">
            <AttackGraph
              assets={useStore((state) => state.assets)}
              attackPaths={useStore((state) => state.attackPaths)}
              onSelectAsset={setSelectedAsset}
            />
          </div>

          <div className="mt-2 h-48 bg-cyber-surface rounded border border-cyber-border overflow-hidden">
            <SOCChatPanel companyId={companyId!} />
          </div>
        </div>

        <div className="w-80 bg-cyber-surface rounded border border-cyber-border overflow-hidden flex flex-col">
          <RiskScorePanel
            company={currentCompany}
            selectedAsset={selectedAsset}
            onAssetClick={setSelectedAsset}
          />
        </div>
      </div>

      {showWhatIf && (
        <WhatIfModal
          companyId={companyId!}
          assets={useStore((state) => state.assets)}
          onClose={() => setShowWhatIf(false)}
        />
      )}
    </div>
  )
}
