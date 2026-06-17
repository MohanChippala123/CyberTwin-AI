import { Company } from '../../api/client'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, LogOut } from 'lucide-react'
import { useState } from 'react'

interface Props {
  company: Company
  onWhatIf: () => void
}

export default function TopNav({ company, onWhatIf }: Props) {
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'var(--high)'
    if (score >= 6) return 'var(--medium)'
    if (score >= 3) return 'var(--low)'
    return 'var(--clean)'
  }

  const getRiskBgColor = (score: number) => {
    if (score >= 8) return 'rgba(239, 68, 68, 0.1)'
    if (score >= 6) return 'rgba(249, 115, 22, 0.1)'
    if (score >= 3) return 'rgba(251, 191, 36, 0.1)'
    return 'rgba(74, 222, 128, 0.1)'
  }

  const getRiskBorderColor = (score: number) => {
    if (score >= 8) return 'rgba(239, 68, 68, 0.2)'
    if (score >= 6) return 'rgba(249, 115, 22, 0.2)'
    if (score >= 3) return 'rgba(251, 191, 36, 0.2)'
    return 'rgba(74, 222, 128, 0.2)'
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px',
            background: 'transparent',
            border: 'none',
            borderRadius: '6px',
            color: 'var(--text-2)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          title="Back to home"
        >
          <ChevronLeft size={16} />
        </button>

        <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '12px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>{company.name}</h2>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-2)',
            marginTop: '4px',
            fontFamily: 'var(--mono)',
            margin: 0
          }}>
            {company.domain}
            {company.industry && ` · ${company.industry}`}
            {company.employee_count && ` · ${company.employee_count} staff`}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          padding: '12px 16px',
          borderRadius: '4px',
          border: `1px solid ${getRiskBorderColor(company.overall_risk_score)}`,
          backgroundColor: getRiskBgColor(company.overall_risk_score)
        }}>
          <p style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Risk</p>
          <p style={{
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'var(--mono)',
            color: getRiskColor(company.overall_risk_score),
            margin: 0
          }}>
            {company.overall_risk_score.toFixed(1)}/10
          </p>
        </div>

        <button
          onClick={onWhatIf}
          className="btn-primary"
          style={{ fontSize: '11px' }}
        >
          Simulate Attack
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-2)',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            title="Menu"
          >
            ⋮
          </button>

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              marginTop: '8px',
              width: '160px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              zIndex: 50,
              overflow: 'hidden'
            }}>
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  handleLogout()
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  fontSize: '12px',
                  color: 'var(--high)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
