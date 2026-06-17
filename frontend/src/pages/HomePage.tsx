import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { client } from '../api/client'
import { useStore } from '../store/useStore'

export default function HomePage() {
  const navigate = useNavigate()
  const { setCurrentCompany, setAssets, setAttackPaths, setLoading, loading, setError, error } = useStore()
  const [organization, setOrganization] = useState('')
  const [domain, setDomain] = useState('')

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!organization.trim() || !domain.trim()) {
      setError('Organization name and domain required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const company = await client.generateCompany({
        name: organization,
        domain: domain,
        industry: 'Enterprise',
        employee_count: 500
      })
      setCurrentCompany(company)
      setAssets(company.assets || [])
      const attackPaths = await client.generateAttackPaths(company.id)
      setAttackPaths(attackPaths.attack_paths || [])
      navigate(`/dashboard/${company.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze')
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#000000', display: 'flex', flexDirection: 'column' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 80, 120, 0.12), transparent 40%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 100, 100, 0.08), transparent 40%)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle at center, rgba(120, 0, 120, 0.06), transparent 50%)',
          }}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingLeft: '16px', paddingRight: '16px', paddingTop: '48px', paddingBottom: '48px', animation: 'heroFadeIn 0.6s cubic-bezier(0.16,1,0.3,1) both', position: 'relative', zIndex: 10 }}>
        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', maxWidth: '520px', marginBottom: '48px' }} className="w-full" />

        <div style={{ maxWidth: '520px' }} className="w-full text-center">
          <div style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'var(--text-3)',
            fontWeight: 500,
            fontFamily: 'var(--mono)',
            marginBottom: '20px',
            opacity: 0.6,
            display: 'inline-block'
          }}>
            Attack Path Analysis
          </div>

          <h1 style={{
            marginBottom: '12px',
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
          }}>
            Where does this
            <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, #9fd830 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              attack
            </span>
            <br />
            chain go?
          </h1>

          <p style={{ marginBottom: '36px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.65 }}>
            Map your infrastructure and simulate realistic attack paths. Understand your blast radius before attackers do.
          </p>

          {error && (
            <div style={{
              marginBottom: '16px',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '4px',
              fontSize: '12px',
              color: 'var(--high)',
              fontFamily: 'var(--mono)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Organization name"
              />

              <input
                type="text"
                value={domain}
                onChange={(e) => {
                  let val = e.target.value.trim().toLowerCase()
                  if (val.startsWith('https://')) val = val.substring(8)
                  if (val.startsWith('http://')) val = val.substring(7)
                  if (val.startsWith('www.')) val = val.substring(4)
                  setDomain(val)
                }}
                placeholder="Domain"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                marginTop: '12px',
                boxShadow: 'var(--bg) 0 0 12px rgba(200, 245, 60, 0.15)',
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>

          <button
            onClick={async () => {
              setLoading(true)
              try {
                const company = await client.seedDemoCompany()
                setCurrentCompany(company)
                setAssets(company.assets || [])
                const attackPaths = await client.getAttackPaths(company.id)
                setAttackPaths(attackPaths.attack_paths || [])
                navigate(`/dashboard/${company.id}`)
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load demo')
                setLoading(false)
              }
            }}
            disabled={loading}
            className="btn-secondary"
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Loading...' : 'or view demo'}
          </button>
        </div>
      </div>
    </div>
  )
}
