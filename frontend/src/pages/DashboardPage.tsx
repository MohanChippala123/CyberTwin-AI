import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { client, Asset } from '../api/client'
import RiskScorePanel from '../components/panels/RiskScorePanel'
import SOCChatPanel from '../components/chat/SOCChatPanel'
import ModalHeader from '../components/shared/ModalHeader'
import { getRiskColor, getRiskStatus, getRiskBgColor, getRiskBorderColor } from '../utils/riskColors'

const titleCase = (str: string) => {
  return str
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export default function DashboardPage() {
  const { companyId } = useParams<{ companyId: string }>()
  const { currentCompany, setCurrentCompany, assets, setAssets, attackPaths, setAttackPaths, setLoading, loading } = useStore()
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [apiKeysOpen, setApiKeysOpen] = useState(false)
  const [notificationCritical, setNotificationCritical] = useState(true)
  const [notificationVulnerabilities, setNotificationVulnerabilities] = useState(true)
  const [notificationDigests, setNotificationDigests] = useState(true)

  useEffect(() => {
    if (!companyId) {
      setError('No company ID')
      return
    }

    const loadData = async () => {
      setLoading(true)
      setLoadingProgress(0)
      setError(null)

      try {
        const progressInterval = setInterval(() => {
          setLoadingProgress((p) => Math.min(p + Math.random() * 30, 90))
        }, 300)

        const company = await client.getCompany(companyId)
        setCurrentCompany(company)
        setLoadingProgress(60)

        const assetsData = await client.getCompanyAssets(companyId)
        setAssets(assetsData)
        setLoadingProgress(80)

        const attackPathsData = await client.getAttackPaths(companyId)
        setAttackPaths(attackPathsData.attack_paths || [])
        setLoadingProgress(100)

        clearInterval(progressInterval)
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error'
        setError(errMsg)
      } finally {
        setLoading(false)
        setLoadingProgress(0)
      }
    }

    loadData()
  }, [companyId, setCurrentCompany, setAssets, setAttackPaths, setLoading])

  if (loading || !currentCompany) {
    return (
      <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', backgroundColor: '#000000' }}>
        <div style={{ textAlign: 'center', maxWidth: '448px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#e8e6e0', margin: 0 }}>Analyzing Infrastructure</h2>
            <p style={{ fontSize: '14px', color: '#8a8880', margin: 0 }}>Building your attack surface map...</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{
              height: '2px',
              background: '#232320',
              borderRadius: '99px',
              overflow: 'hidden',
              marginBottom: '12px'
            }}>
              <div
                style={{
                  height: '100%',
                  background: '#c8f53c',
                  borderRadius: '99px',
                  width: `${loadingProgress}%`,
                  transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)'
                }}
              ></div>
            </div>
            <p style={{ fontSize: '11px', color: '#48473f', fontFamily: "'IBM Plex Mono', monospace", marginTop: '12px', margin: 0 }}>{Math.round(loadingProgress)}%</p>
          </div>

          <p style={{ fontSize: '11px', color: '#48473f', margin: 0 }}>Usually completes in 20-30 seconds</p>
          {error && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '16px', margin: 0 }}>Error: {error}</p>}
        </div>
      </div>
    )
  }


  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#000000', display: 'flex', flexDirection: 'column', color: '#e8e6e0', fontFamily: "'Syne', sans-serif", overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '16px 48px',
        backgroundColor: '#111110',
        borderBottom: '1px solid #232320',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#e8e6e0' }}>
            {currentCompany.is_demo ? 'DEMO' : currentCompany.name}
          </h1>
          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#8a8880', fontFamily: "'IBM Plex Mono', monospace" }}>
            {currentCompany.domain}
          </p>
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#8a8880',
            fontSize: '20px',
            padding: '8px',
            borderRadius: '4px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#e8e6e0'
            e.currentTarget.style.backgroundColor = '#232320'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#8a8880'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
          </svg>
        </button>
      </div>

      {/* Main Content - Two Column Layout */}
      <div style={{ flex: 1, display: 'flex', gap: '0', overflow: 'hidden', minHeight: 0 }}>
        {/* Left Panel - Risk Analysis */}
        <div style={{
          width: '50%',
          backgroundColor: '#000000',
          borderRight: '1px solid #232320',
          overflow: 'auto',
          flexShrink: 0,
          padding: '80px 64px'
        }}>
          <RiskScorePanel
            company={currentCompany}
            selectedAsset={selectedAsset}
            onAssetClick={setSelectedAsset}
            assets={assets}
          />
        </div>

        {/* Right Panel - Asset Visualization */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          minHeight: 0,
          padding: '80px 64px',
          backgroundColor: '#000000'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', height: '100%' }}>
            {/* Assets Grid Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#c8f53c' }}></div>
                <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#e8e6e0', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'IBM Plex Mono', monospace" }}>Assets ({assets.length})</h2>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '32px'
              }}>
              {assets.map(asset => {
                const color = getRiskColor(asset.risk_score)
                const status = getRiskStatus(asset.risk_score)
                const bg = getRiskBgColor(asset.risk_score)
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    style={{
                      padding: '40px',
                      backgroundColor: '#111110',
                      border: '1px solid #232320',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                      position: 'relative',
                      overflow: 'hidden',
                      minHeight: '160px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = color
                      e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.4), 0 0 12px ${color}20`
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#232320'
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '2px',
                      background: color
                    }}></div>

                    <p style={{ margin: '0 0 16px 0', fontWeight: 600, color: '#e8e6e0', fontSize: '13px' }}>
                      {titleCase(asset.name)}
                    </p>
                    <p style={{ margin: '0 0 24px 0', fontSize: '11px', color: '#8a8880', fontFamily: "'IBM Plex Mono', monospace", textTransform: 'capitalize' }}>
                      {asset.asset_type}
                    </p>
                    <div style={{
                      padding: '4px 8px',
                      backgroundColor: bg,
                      borderRadius: '2px',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: color,
                      textAlign: 'center',
                      fontFamily: "'IBM Plex Mono', monospace",
                      display: 'inline-block',
                      border: `1px solid ${color}40`
                    }}>
                      {status}
                    </div>
                  </div>
                )
              })}
            </div>
            </div>

            {/* Key Metrics Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#c8f53c' }}></div>
                <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#e8e6e0', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'IBM Plex Mono', monospace" }}>Summary</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                {/* Critical Assets Count */}
                <div style={{
                  padding: '32px',
                  backgroundColor: '#111110',
                  border: '1px solid #232320',
                  borderRadius: '4px'
                }}>
                  <p style={{ fontSize: '11px', color: '#8a8880', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', fontFamily: "'IBM Plex Mono', monospace" }}>Critical Assets</p>
                  <p style={{ fontSize: '32px', fontWeight: 700, color: '#ef4444', margin: 0 }}>
                    {assets.filter(a => a.risk_score >= 8).length}
                  </p>
                </div>

                {/* High Risk Assets Count */}
                <div style={{
                  padding: '32px',
                  backgroundColor: '#111110',
                  border: '1px solid #232320',
                  borderRadius: '4px'
                }}>
                  <p style={{ fontSize: '11px', color: '#8a8880', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', fontFamily: "'IBM Plex Mono', monospace" }}>High Risk Assets</p>
                  <p style={{ fontSize: '32px', fontWeight: 700, color: '#f97316', margin: 0 }}>
                    {assets.filter(a => a.risk_score >= 6 && a.risk_score < 8).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <>
          <div
            onClick={() => setSettingsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 50
            }}
          ></div>
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '520px',
              maxHeight: '80vh',
              backgroundColor: '#111110',
              border: '1px solid #232320',
              borderRadius: '8px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
              zIndex: 51,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <ModalHeader title="Settings" onClose={() => setSettingsOpen(false)} />

            {/* Settings Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '32px'
            }}>
              {/* Account Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#c8f53c',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '16px',
                  fontFamily: "'IBM Plex Mono', monospace"
                }}>Account</h3>
                <button
                  onClick={() => alert(`User: ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).email : 'demo@cybertwin.io'}\n\nCompany: ${currentCompany.name}\nDomain: ${currentCompany.domain}`)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#e8e6e0',
                    border: '1px solid #232320',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#8a8880'
                    e.currentTarget.style.backgroundColor = '#1a1a18'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#232320'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <span>Account Profile</span>
                  <span style={{ fontSize: '12px', color: '#8a8880' }}>→</span>
                </button>
              </div>

              {/* Notifications Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#c8f53c',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '16px',
                  fontFamily: "'IBM Plex Mono', monospace"
                }}>Notifications</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#e8e6e0', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={notificationCritical}
                      onChange={(e) => setNotificationCritical(e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    Critical Risk Alerts
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#e8e6e0', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={notificationVulnerabilities}
                      onChange={(e) => setNotificationVulnerabilities(e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    New Vulnerabilities
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#e8e6e0', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={notificationDigests}
                      onChange={(e) => setNotificationDigests(e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    Report Digests
                  </label>
                </div>
              </div>

              {/* Data & Privacy Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#c8f53c',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '16px',
                  fontFamily: "'IBM Plex Mono', monospace"
                }}>Data & Privacy</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => {
                      const report = {
                        company: currentCompany.name,
                        domain: currentCompany.domain,
                        overallRiskScore: currentCompany.overall_risk_score,
                        assetCount: assets.length,
                        criticalAssets: assets.filter(a => a.risk_score >= 8).length,
                        exportDate: new Date().toISOString()
                      }
                      const element = document.createElement('a')
                      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2)))
                      element.setAttribute('download', `${currentCompany.name}-report-${Date.now()}.json`)
                      element.style.display = 'none'
                      document.body.appendChild(element)
                      element.click()
                      document.body.removeChild(element)
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '14px',
                      color: '#e8e6e0',
                      border: '1px solid #232320',
                      borderRadius: '4px',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#8a8880'
                      e.currentTarget.style.backgroundColor = '#1a1a18'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#232320'
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    Export Analysis Report
                  </button>
                  <button
                    onClick={() => setApiKeysOpen(true)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '14px',
                      color: '#e8e6e0',
                      border: '1px solid #232320',
                      borderRadius: '4px',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#8a8880'
                      e.currentTarget.style.backgroundColor = '#1a1a18'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#232320'
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    API Keys
                  </button>
                  <button
                    onClick={() => window.open('https://cybertwin.io/privacy', '_blank')}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '14px',
                      color: '#e8e6e0',
                      border: '1px solid #232320',
                      borderRadius: '4px',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#8a8880'
                      e.currentTarget.style.backgroundColor = '#1a1a18'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#232320'
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    Privacy Policy
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div style={{ borderTop: '1px solid #232320', paddingTop: '32px' }}>
                <h3 style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#ef4444',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '16px',
                  fontFamily: "'IBM Plex Mono', monospace"
                }}>Danger Zone</h3>
                <button
                  onClick={() => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    window.location.href = '/login'
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontWeight: 600
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)'
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes slideUp {
              from {
                transform: translate(-50%, -40%);
                opacity: 0;
              }
              to {
                transform: translate(-50%, -50%);
                opacity: 1;
              }
            }
          `}</style>
        </>
      )}

      {/* API Keys Modal */}
      {apiKeysOpen && (
        <>
          <div
            onClick={() => setApiKeysOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 50
            }}
          ></div>
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '520px',
              backgroundColor: '#111110',
              border: '1px solid #232320',
              borderRadius: '8px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
              zIndex: 51,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <ModalHeader title="API Keys" onClose={() => setApiKeysOpen(false)} />

            {/* Modal Content */}
            <div style={{ padding: '32px' }}>
              <p style={{ color: '#8a8880', marginBottom: '24px', fontSize: '14px' }}>
                Your API keys grant access to the CyberTwin API. Keep them secure!
              </p>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#8a8880', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontFamily: "'IBM Plex Mono', monospace" }}>
                  Production Key
                </label>
                <div style={{
                  padding: '12px 14px',
                  backgroundColor: '#0a0a08',
                  border: '1px solid #232320',
                  borderRadius: '4px',
                  color: '#c8f53c',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '12px',
                  wordBreak: 'break-all',
                  userSelect: 'all'
                }}>
                  [PRODUCTION_API_KEY_HIDDEN]
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#8a8880', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontFamily: "'IBM Plex Mono', monospace" }}>
                  Test Key
                </label>
                <div style={{
                  padding: '12px 14px',
                  backgroundColor: '#0a0a08',
                  border: '1px solid #232320',
                  borderRadius: '4px',
                  color: '#c8f53c',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '12px',
                  wordBreak: 'break-all',
                  userSelect: 'all'
                }}>
                  [TEST_API_KEY_HIDDEN]
                </div>
              </div>

              <button
                onClick={() => {
                  alert('New API key generated!')
                  setApiKeysOpen(false)
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#c8f53c',
                  color: '#0a0a08',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d4f94a')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#c8f53c')}
              >
                Generate New Key
              </button>
            </div>
          </div>
        </>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={() => setChatOpen(true)}
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#c8f53c',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(200, 245, 60, 0.5)',
          transition: 'all 0.2s',
          zIndex: 40
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.12)'
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(200, 245, 60, 0.6)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(200, 245, 60, 0.5)'
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0a0a08" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      {/* Chat Modal */}
      {chatOpen && (
        <>
          <div
            onClick={() => setChatOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 50
            }}
          ></div>
          <div
            style={{
              position: 'fixed',
              bottom: '40px',
              right: '40px',
              width: '480px',
              height: '600px',
              backgroundColor: '#111110',
              border: '1px solid #232320',
              borderRadius: '8px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
              zIndex: 51,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #232320',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0
            }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#e8e6e0', margin: 0 }}>Security Analyst</h3>
                <p style={{ fontSize: '11px', color: '#8a8880', margin: '4px 0 0 0' }}>AI-powered attack analysis</p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#8a8880',
                  fontSize: '24px',
                  padding: '0',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#e8e6e0')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8a8880')}
              >
                ✕
              </button>
            </div>

            {/* Chat Content */}
            <div style={{ flex: 1, minHeight: 0 }}>
              <SOCChatPanel companyId={companyId!} />
            </div>
          </div>

          <style>{`
            @keyframes slideUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `}</style>
        </>
      )}
    </div>
  )
}
