import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, User } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#131829] to-[#1a1f3a] flex">
      {/* Left side - Premium branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 border-r border-[#2a3150] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent">
              CyberTwin
            </h1>
          </div>
          <p className="text-[#a1afc7] text-lg mt-2">Attack Surface Intelligence</p>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-xs font-semibold text-[#7a8699] uppercase tracking-widest mb-4">Capabilities</p>
            <ul className="space-y-3">
              <li className="flex gap-3 text-[#a1afc7]">
                <span className="text-[#3b82f6] font-bold mt-1">▸</span>
                <span>Map digital attack surface in minutes</span>
              </li>
              <li className="flex gap-3 text-[#a1afc7]">
                <span className="text-[#3b82f6] font-bold mt-1">▸</span>
                <span>Simulate realistic attack chains with AI</span>
              </li>
              <li className="flex gap-3 text-[#a1afc7]">
                <span className="text-[#3b82f6] font-bold mt-1">▸</span>
                <span>Identify critical vulnerabilities instantly</span>
              </li>
              <li className="flex gap-3 text-[#a1afc7]">
                <span className="text-[#3b82f6] font-bold mt-1">▸</span>
                <span>Get AI-powered security recommendations</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-[#2a3150]">
            <p className="text-xs font-semibold text-[#7a8699] uppercase tracking-widest">Built for</p>
            <p className="text-[#a1afc7] mt-2">Security teams who need to understand their attack surface before the bad guys do.</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="max-w-sm mx-auto w-full relative z-10">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#e8ecf1]">
              {isLogin ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="text-[#a1afc7] mt-2">
              {isLogin ? 'Sign in to your account to continue' : 'Create your account to begin'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-[#2a3150] pb-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`text-sm font-bold pb-2 px-3 transition-all ${
                isLogin
                  ? 'text-[#3b82f6] border-b-2 border-[#3b82f6]'
                  : 'text-[#a1afc7] hover:text-[#e8ecf1]'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`text-sm font-bold pb-2 px-3 transition-all ${
                !isLogin
                  ? 'text-[#3b82f6] border-b-2 border-[#3b82f6]'
                  : 'text-[#a1afc7] hover:text-[#e8ecf1]'
              }`}
            >
              Create account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#e8ecf1] mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 w-4 h-4 text-[#7a8699]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* Username (signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-[#e8ecf1] mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-3 w-4 h-4 text-[#7a8699]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your-username"
                    required
                    className="pl-10 w-full"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#e8ecf1] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 w-4 h-4 text-[#7a8699]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="animate-slide p-4 bg-red-500/10 border border-[#ff4757] rounded-lg text-sm text-[#ff4757] font-medium">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary mt-6 h-11 text-base"
            >
              {loading ? 'Authenticating...' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {/* Demo info */}
          <div className="mt-8 p-4 bg-gradient-to-br from-[#1a1f3a] to-[#131829] border border-[#2a3150] rounded-lg space-y-3 hover:border-[#3b82f6] transition-all">
            <p className="text-xs font-bold text-[#7a8699] uppercase tracking-widest">Demo credentials</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a1afc7]">Email</span>
                <code className="bg-[#0a0e27] px-2 py-1 rounded text-[#60a5fa] font-mono">demo@example.com</code>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a1afc7]">Password</span>
                <code className="bg-[#0a0e27] px-2 py-1 rounded text-[#60a5fa] font-mono">demo123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
