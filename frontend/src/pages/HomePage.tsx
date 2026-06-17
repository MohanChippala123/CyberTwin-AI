import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { client } from '../api/client'
import { useStore } from '../store/useStore'

export default function HomePage() {
  const navigate = useNavigate()
  const { setCurrentCompany, setAssets, setAttackPaths, setLoading, setError, loading, error } = useStore()
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
    <div className="min-h-screen bg-[#0f1117] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#30363d] px-6 py-4">
        <h1 className="text-xl font-bold text-[#e6edf3]">CyberTwin AI</h1>
        <p className="text-sm text-[#8b949e]">Attack Surface Intelligence Platform</p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - intro */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-bold text-[#e6edf3] mb-4">Map Your Attack Surface</h2>
              <p className="text-sm text-[#8b949e] mb-6 leading-relaxed">
                Simulate realistic attack paths against your infrastructure. Understand vulnerability chains before they're exploited.
              </p>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="text-[#238636]">✓</div>
                  <div className="text-sm text-[#8b949e]">AI-powered attack simulation</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-[#238636]">✓</div>
                  <div className="text-sm text-[#8b949e]">MITRE ATT&CK mapped techniques</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-[#238636]">✓</div>
                  <div className="text-sm text-[#8b949e]">Real-time risk scoring</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-[#238636]">✓</div>
                  <div className="text-sm text-[#8b949e]">SOC analyst insights</div>
                </div>
              </div>
            </div>

            {/* Right - forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* New company form */}
              <div className="card">
                <h3 className="text-sm font-bold text-[#e6edf3] mb-4">Analyze New Organization</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#8b949e] mb-2">Organization name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Acme Corp"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8b949e] mb-2">Primary domain</label>
                    <input
                      type="text"
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      placeholder="example.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#8b949e] mb-2">Industry</label>
                      <input
                        type="text"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        placeholder="SaaS"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#8b949e] mb-2">Headcount</label>
                      <input
                        type="number"
                        value={formData.employee_count}
                        onChange={(e) => setFormData({ ...formData, employee_count: parseInt(e.target.value) })}
                        placeholder="150"
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="w-full btn-primary mt-4">
                    {loading ? 'Generating digital twin...' : 'Analyze'}
                  </button>
                </form>
              </div>

              {/* Demo button */}
              <div className="card bg-[#161b22]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#e6edf3]">Try the demo</h3>
                    <p className="text-xs text-[#8b949e] mt-1">Explore with TechStartup Inc (8 assets, 2 attack paths)</p>
                  </div>
                  <button
                    onClick={handleLoadDemo}
                    disabled={isLoadingDemo}
                    className="btn-primary"
                  >
                    {isLoadingDemo ? 'Loading...' : 'Load demo'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-[rgba(248,81,73,0.1)] border border-[#f85149] rounded text-sm text-[#f85149]">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
