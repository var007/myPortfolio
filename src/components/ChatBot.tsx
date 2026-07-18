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
  content: "Hi, I'm Ivar's portfolio assistant. Ask me about his skills, projects, services, or how to get in touch.",
}

const replyDelay = 520

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  }
}

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword))
}

function getTemplateReply(input: string) {
  const question = input.toLowerCase()

  if (/\b(hi|hello|hey)\b/.test(question) || includesAny(question, ['good morning', 'good afternoon', 'good evening'])) {
    return "Hello! I'm here to help you learn about Ivar Hinisan, his projects, skills, services, and contact details."
  }

  if (includesAny(question, ['contact', 'email', 'phone', 'call', 'message', 'reach'])) {
    return 'You can contact Ivar through the contact section, email him at ivarhinisan@email.com, or call +63 912 345 6789.'
  }

  if (includesAny(question, ['hire', 'available', 'collaborate', 'work with', 'freelance', 'client'])) {
    return 'Yes, Ivar is open to opportunities, collaborations, and interesting frontend projects. The best way to start is by sending a message through the contact section or emailing ivarhinisan@email.com.'
  }

  if (includesAny(question, ['cv', 'resume', 'download'])) {
    return 'You can download Ivar\'s CV using the Download CV button in the navigation or hero section.'
  }

  if (includesAny(question, ['github', 'source code', 'repository', 'repo'])) {
    return 'You can view Ivar\'s GitHub here: https://github.com/ivarhinisan.'
  }

  if (includesAny(question, ['linkedin'])) {
    return 'You can connect with Ivar on LinkedIn here: https://linkedin.com/in/ivarhinisan.'
  }

  if (includesAny(question, ['facebook'])) {
    return 'You can find Ivar on Facebook here: https://facebook.com/ivarhinisan.'
  }

  if (includesAny(question, ['skill', 'skills', 'technology', 'technologies', 'tools', 'stack'])) {
    return 'Ivar works with React, TypeScript, JavaScript, HTML/CSS, responsive design, UI/UX design, Node.js, Git, databases, Tailwind CSS, GitHub, and CLI tools.'
  }

  if (includesAny(question, ['experience', 'years', 'client', 'stats'])) {
    return 'Ivar has 1+ years of experience, 10+ completed projects, experience with 5+ technologies, and 3+ happy clients.'
  }

  if (includesAny(question, ['project', 'projects', 'portfolio', 'built', 'made', 'work'])) {
    return 'His featured projects include an E-Commerce Platform, Weather Dashboard, Task Manager, and this Portfolio Website. You can explore them in the Projects section.'
  }

  if (includesAny(question, ['service', 'services', 'build', 'website', 'web app', 'mobile', 'design', 'what can', 'what does'])) {
    return 'Ivar can help with frontend development, responsive web design, UI/UX refinement, and mobile-friendly web experiences.'
  }

  if (includesAny(question, ['location', 'where', 'country', 'based'])) {
    return 'Ivar is based in the Philippines and is open to online collaboration.'
  }

  if (includesAny(question, ['who', 'about', 'ivar', 'profile', 'student', 'developer'])) {
    return 'Ivar Hinisan is an IT student and frontend developer who builds clean, modern, and user-friendly web and mobile interfaces.'
  }

  return 'I can answer questions about Ivar\'s skills, projects, services, CV, and contact details. For anything specific, you can also email him at ivarhinisan@email.com.'
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

  function sendMessage(nextInput = input) {
    const text = nextInput.trim()

    if (!text || loading) return

    const userMessage = createMessage('user', text)
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    window.setTimeout(() => {
      setMessages([...nextMessages, createMessage('assistant', getTemplateReply(text))])
      setLoading(false)
    }, replyDelay)
  }

  return (
    <div className={`chatbot${open ? ' open' : ''}`}>
      {open && (
        <section className="chatbot-panel" role="dialog" aria-label="Ivar portfolio chatbot">
          <div className="chatbot-header">
            <div className="chatbot-avatar" aria-hidden="true">
              <Bot size={20} />
            </div>
            <div>
              <p className="chatbot-kicker">Portfolio Assistant</p>
              <h2>Ivar Bot</h2>
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
            <label className="sr-only" htmlFor="chatbot-input">Ask Ivar Bot</label>
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
          Ask Bot
        </span>
      </button>
    </div>
  )
}
