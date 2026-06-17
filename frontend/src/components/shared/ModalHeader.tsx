interface ModalHeaderProps {
  title: string
  onClose: () => void
}

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div style={{
      padding: '24px 32px',
      borderBottom: '1px solid #232320',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e8e6e0', margin: 0 }}>
        {title}
      </h2>
      <button
        onClick={onClose}
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
  )
}
