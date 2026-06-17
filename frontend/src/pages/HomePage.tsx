import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { client } from '../api/client'
import { useStore } from '../store/useStore'

export default function HomePage() {
  const navigate = useNavigate()
  const { setCurrentCompany, setAssets, setAttackPaths, setLoading, setError } = useStore()
  const [formData, setFormData] = useState({ name: '', domain: '', industry: 'SaaS', employee_count: 150 })
  const [isLoadingDemo, setIsLoadingDemo] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const company = await client.generateCompany(formData)
      setCurrentCompany(company)
      setAssets(company.assets || [])

      const attackPaths = await client.generateAttackPaths(company.id)
      setAttackPaths(attackPaths.attack_paths || [])

      navigate(`/dashboard/${company.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate company')
      setLoading(false)
    }
  }

  const handleLoadDemo = async () => {
    setIsLoadingDemo(true)
    setLoading(true)
    setError(null)

    try {
      const company = await client.seedDemoCompany()
      setCurrentCompany(company)
      setAssets(company.assets || [])

      const attackPaths = await client.getAttackPaths(company.id)
      setAttackPaths(attackPaths.attack_paths || [])

      navigate(`/dashboard/${company.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load demo')
      setIsLoadingDemo(false)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-900/20 to-cyber-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-cyber-cyan mb-4">CyberTwin AI</h1>
          <p className="text-xl text-cyber-muted">Digital Twin Attack Simulator</p>
          <p className="text-sm text-gray-500 mt-2">Simulate how attackers could compromise your digital infrastructure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="bg-cyber-surface border border-cyber-border rounded-lg p-8">
            <h2 className="text-xl font-bold text-white mb-6">Create New Company</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Acme Corp"
                  className="cyber-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Domain</label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="acme.com"
                  className="cyber-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="SaaS"
                  className="cyber-input w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Employees</label>
                <input
                  type="number"
                  value={formData.employee_count}
                  onChange={(e) => setFormData({ ...formData, employee_count: parseInt(e.target.value) })}
                  className="cyber-input w-full"
                />
              </div>

              <button
                type="submit"
                disabled={useStore((state) => state.loading)}
                className="w-full py-2 bg-cyan-600 text-white rounded font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50"
              >
                {useStore((state) => state.loading) ? 'Generating...' : 'Generate Digital Twin'}
              </button>
            </div>
          </form>

          <div className="bg-cyber-surface border border-cyber-border rounded-lg p-8 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-white mb-4">Demo</h2>
            <p className="text-gray-400 mb-6">Explore with our pre-configured TechStartup Inc demo company with sample attack scenarios.</p>

            <button
              onClick={handleLoadDemo}
              disabled={isLoadingDemo}
              className="py-3 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoadingDemo ? 'Loading Demo...' : '▶ Load Demo Company'}
            </button>

            <div className="mt-6 pt-6 border-t border-cyber-border">
              <p className="text-xs text-gray-500 mb-2">Demo includes:</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>✓ 8 realistic assets</li>
                <li>✓ 2 attack scenarios</li>
                <li>✓ CVE mappings</li>
                <li>✓ SOC analyst chat</li>
              </ul>
            </div>
          </div>
        </div>

        {useStore((state) => state.error) && (
          <div className="mt-6 p-4 bg-red-900/20 border border-cyber-red rounded text-cyber-red">
            {useStore((state) => state.error)}
          </div>
        )}
      </div>
    </div>
  )
}
