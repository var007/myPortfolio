import { useEffect, useRef, useState } from 'react'
import { Bot, Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react'

type ChatMessage = {
  id: string
  role: 'assistant' | 'user'
  content: string
}

const starterPrompts = [
  'What can Ivar build?',
  'Tell me about his skills',
  'How can I contact him?',
]

const welcomeMessage: ChatMessage = {
  id: 'welcome-message',
  role: 'assistant',
  content: "Hi, I'm Ivar's AI assistant. Ask me about his skills, projects, services, or how to get in touch.",
}

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  }
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, open, loading])

  async function sendMessage(nextInput = input) {
    const text = nextInput.trim()

    if (!text || loading) return

    const userMessage = createMessage('user', text)
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || 'The chatbot is unavailable right now.')
      }

      setMessages([...nextMessages, createMessage('assistant', data.reply)])
    } catch (error) {
      console.error(error)
      setMessages([
        ...nextMessages,
        createMessage(
          'assistant',
          "I'm having trouble reaching the AI service right now. You can still contact Ivar at ivarhinisan@email.com."
        ),
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`chatbot${open ? ' open' : ''}`}>
      {open && (
        <section className="chatbot-panel" role="dialog" aria-label="Ivar AI chatbot">
          <div className="chatbot-header">
            <div className="chatbot-avatar" aria-hidden="true">
              <Bot size={20} />
            </div>
            <div>
              <p className="chatbot-kicker">Portfolio Assistant</p>
              <h2>Ivar AI</h2>
            </div>
            <button
              type="button"
              className="chatbot-close"
              aria-label="Close chatbot"
              onClick={() => setOpen(false)}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="chatbot-messages" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`chatbot-message ${message.role}`}>
                <p>{message.content}</p>
              </div>
            ))}

            {loading && (
              <div className="chatbot-message assistant loading">
                <Loader2 size={16} aria-hidden="true" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-prompts" aria-label="Suggested questions">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                disabled={loading}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="chatbot-form"
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage()
            }}
          >
            <label className="sr-only" htmlFor="chatbot-input">Ask Ivar AI</label>
            <input
              id="chatbot-input"
              type="text"
              value={input}
              placeholder="Ask about Ivar..."
              maxLength={500}
              onChange={(event) => setInput(event.target.value)}
            />
            <button type="submit" aria-label="Send message" disabled={loading || !input.trim()}>
              <Send size={17} aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chatbot-toggle"
        aria-label={open ? 'Close chatbot' : 'Open chatbot'}
        aria-expanded={open}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        {open ? <X size={24} aria-hidden="true" /> : <MessageCircle size={24} aria-hidden="true" />}
        <span>
          <Sparkles size={15} aria-hidden="true" />
          Ask AI
        </span>
      </button>
    </div>
  )
}
