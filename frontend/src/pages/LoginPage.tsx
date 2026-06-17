import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { client } from '../api/client'
import { useStore } from '../store/useStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setCurrentCompany, setAssets, setAttackPaths, setLoading: setStoreLoading } = useStore()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const body = isLogin ? { email, password } : { email, username, password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Authentication failed')
      }

      const data = await response.json()
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
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
            Secure Access
          </div>

          <h1 style={{ marginBottom: '12px' }}>
            {isLogin ? 'Sign in' : 'Create account'}
          </h1>

          <p style={{ marginBottom: '36px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
            {isLogin ? 'Access your attack surface analysis' : 'Get started with CyberTwin'}
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />

            {!isLogin && (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            )}

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: '12px' }}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '20px 0',
            opacity: 0.5
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
            <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
          </div>

          <button
            onClick={async () => {
              setLoading(true)
              try {
                localStorage.setItem('token', 'demo_token_' + Date.now())
                localStorage.setItem('user', JSON.stringify({
                  id: 'demo_user',
                  email: 'demo@cybertwin.io',
                  username: 'DemoUser'
                }))

                const company = await client.seedDemoCompany()
                setCurrentCompany(company)
                setAssets(company.assets || [])
                const attackPaths = await client.getAttackPaths(company.id)
                setAttackPaths(attackPaths.attack_paths || [])

                navigate(`/dashboard/${company.id}`)
              } catch (err) {
                setError('Demo login failed')
                setLoading(false)
              }
            }}
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px 20px',
              borderRadius: '4px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface-2)',
              color: 'var(--text)',
              cursor: 'pointer',
              fontFamily: 'var(--mono)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: loading ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.backgroundColor = 'var(--bg)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.backgroundColor = 'var(--surface-2)'
              }
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
            Demo Login
          </button>

          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setEmail('')
              setUsername('')
              setPassword('')
            }}
            className="btn-secondary"
            style={{ marginTop: '24px' }}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
