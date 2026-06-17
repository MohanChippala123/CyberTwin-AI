import { useState, useRef, useEffect } from 'react'
import { client } from '../../api/client'
import { Send } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  companyId: string
}

export default function SOCChatPanel({ companyId }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Security Analyst ready. Ask about attack paths, risk mitigation, or simulation results.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    'What are the highest-risk attack paths?',
    'How to mitigate critical findings?',
    'Explain the exposed database access chain',
    'What would happen if Admin account leaked?',
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: messageText }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await client.sendChatMessage(companyId, messageText)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--surface)' }}>
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '28px 32px',
        backgroundColor: 'var(--surface)'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Security Analyst</h3>
        <p style={{ fontSize: '11px', color: 'var(--text-2)', marginTop: '8px', margin: 0 }}>AI-powered attack analysis</p>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                lineHeight: 1.6,
                backgroundColor: msg.role === 'user' ? 'var(--accent)' : 'var(--surface-2)',
                color: msg.role === 'user' ? '#0a0a08' : 'var(--text-2)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                wordBreak: 'break-word'
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
            <div style={{
              fontSize: '10px',
              color: 'var(--text-3)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: 'var(--mono)'
            }}>Suggestions</div>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(suggestion)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 14px',
                  fontSize: '11px',
                  color: 'var(--text-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.backgroundColor = 'var(--bg)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text-2)',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: 'var(--accent)',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s infinite'
                }}></div>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: 'var(--accent)',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s infinite',
                  animationDelay: '0.2s'
                }}></div>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: 'var(--accent)',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s infinite',
                  animationDelay: '0.4s'
                }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '28px 32px',
        backgroundColor: 'var(--surface)'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about risk mitigation..."
            disabled={loading}
            style={{
              flex: 1,
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '10px 14px',
              borderRadius: '4px',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'text'
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--accent)',
              color: '#0a0a08',
              border: 'none',
              borderRadius: '4px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? 0.6 : 1,
              transition: 'background-color 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.backgroundColor = '#d4f94a'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.backgroundColor = 'var(--accent)'
              }
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}
