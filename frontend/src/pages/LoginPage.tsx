import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
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
    <div className="min-h-screen bg-[#0f1117] flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-[#30363d]">
        <div>
          <h1 className="text-2xl font-bold text-[#e6edf3]">CyberTwin AI</h1>
          <p className="text-[#8b949e] mt-2">Attack Surface Intelligence</p>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-[#6e7681] mb-2">What you can do:</p>
            <ul className="space-y-2 text-sm text-[#8b949e]">
              <li>• Map your digital attack surface</li>
              <li>• Simulate realistic attack paths</li>
              <li>• Identify critical vulnerabilities</li>
              <li>• Get AI-powered security insights</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12">
        <div className="max-w-sm mx-auto w-full">
          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-[#30363d]">
            <button
              onClick={() => setIsLogin(true)}
              className={`pb-3 px-4 text-sm font-medium transition-colors ${
                isLogin ? 'text-[#e6edf3] border-b-2 border-[#1f6feb]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`pb-3 px-4 text-sm font-medium transition-colors ${
                !isLogin ? 'text-[#e6edf3] border-b-2 border-[#1f6feb]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#e6edf3] mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#e6edf3] mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your-username"
                  required
                  className="w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#e6edf3] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full"
              />
            </div>

            {error && (
              <div className="p-3 bg-[rgba(248,81,73,0.1)] border border-[#f85149] rounded text-[#f85149] text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary mt-6"
            >
              {loading ? 'Authenticating...' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-[#161b22] border border-[#30363d] rounded space-y-2">
            <p className="text-xs font-medium text-[#8b949e]">Demo mode</p>
            <div className="text-xs text-[#6e7681] space-y-1">
              <div className="flex justify-between"><span>Email:</span> <code className="text-[#79c0ff]">demo@example.com</code></div>
              <div className="flex justify-between"><span>Password:</span> <code className="text-[#79c0ff]">demo123</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
