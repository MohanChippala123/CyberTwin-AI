const API_BASE = '/api'

export interface Company {
  id: string
  name: string
  domain: string
  industry?: string
  employee_count?: number
  overall_risk_score: number
  is_demo: boolean
  created_at: string
  assets?: Asset[]
}

export interface Asset {
  id: string
  company_id: string
  name: string
  asset_type: string
  ip_address?: string
  os?: string
  services: string[]
  risk_score: number
  status: 'safe' | 'moderate' | 'warning' | 'critical'
  cve_ids: string[]
  pos_x: number
  pos_y: number
  created_at: string
}

export interface AttackPath {
  id: string
  company_id: string
  name: string
  description?: string
  severity: string
  mitre_tactics: string[]
  steps: any[]
  source_asset_id?: string
  target_asset_id?: string
  likelihood: number
  impact: number
  created_at: string
}

export interface CVE {
  id: string
  description: string
  cvss_score: number
  severity: string
  published: string
  references: string[]
}

async function apiCall(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE}${endpoint}`
  const token = localStorage.getItem('token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    headers,
    ...options,
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API Error: ${response.status} - ${error}`)
  }

  return response.json()
}

export const client = {
  // Company endpoints
  generateCompany: (data: { name: string; domain: string; industry?: string; employee_count?: number }) =>
    apiCall('/company/generate', { method: 'POST', body: JSON.stringify(data) }),

  getCompany: (companyId: string) =>
    apiCall(`/company/${companyId}`),

  // Assets endpoints
  getCompanyAssets: (companyId: string) =>
    apiCall(`/assets/${companyId}`),

  getAsset: (assetId: string) =>
    apiCall(`/assets/asset/${assetId}`),

  // Attack paths
  generateAttackPaths: (companyId: string) =>
    apiCall(`/attack/generate?company_id=${companyId}`, { method: 'POST' }),

  getAttackPaths: (companyId: string) =>
    apiCall(`/attack/${companyId}`),

  // Chat
  sendChatMessage: (companyId: string, message: string, sessionId?: string) =>
    apiCall('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ company_id: companyId, session_id: sessionId, message }),
    }),

  getChatSession: (sessionId: string) =>
    apiCall(`/chat/session/${sessionId}`),

  // What-If
  runWhatIfSimulation: (companyId: string, scenario: string, affectedAssetId?: string) =>
    apiCall(`/whatif/simulate?company_id=${companyId}&scenario=${encodeURIComponent(scenario)}&affected_asset_id=${affectedAssetId}`, {
      method: 'POST',
    }),

  getWhatIfScenarios: () =>
    apiCall('/whatif/scenarios'),

  // CVE
  lookupAssetCVEs: (assetId: string) =>
    apiCall(`/cve/lookup/${assetId}`),

  searchCVEs: (query: string, limit?: number) =>
    apiCall(`/cve/search?query=${encodeURIComponent(query)}&limit=${limit || 10}`),

  // Reports
  getCompanyReport: (companyId: string) =>
    apiCall(`/report/${companyId}`),

  downloadReport: (companyId: string) =>
    apiCall(`/report/${companyId}/download`),

  // Demo
  listDemoCompanies: () =>
    apiCall('/demo/companies'),

  seedDemoCompany: () =>
    apiCall('/demo/seed', { method: 'POST' }),
}
