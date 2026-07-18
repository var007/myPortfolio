type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  role: ChatRole
  content: string
}

type ApiRequest = {
  method?: string
  body?: unknown
}

type ApiResponse = {
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
}

const SYSTEM_PROMPT = `You are Ivar Hinisan's portfolio chatbot.

Your job is to help visitors learn about Ivar and guide them around the portfolio.
Keep replies friendly, concise, and useful. Prefer 1 to 4 short sentences. If asked about something unrelated to Ivar's portfolio, briefly answer only if helpful, then redirect to Ivar's work or contact options.

Portfolio facts:
- Name: Ivar Hinisan.
- Role: IT Student and Frontend Developer.
- Location: Philippines.
- Email: ivarhinisan@email.com.
- Phone: +63 912 345 6789.
- GitHub: https://github.com/ivarhinisan.
- LinkedIn: https://linkedin.com/in/ivarhinisan.
- Facebook: https://facebook.com/ivarhinisan.
- Summary: Ivar designs and builds responsive, modern, user-friendly web and mobile experiences with polished interfaces and reliable frontend applications.
- Experience: 1+ years experience, 10+ projects completed, 5+ technologies, 3+ happy clients.
- Skills: React, TypeScript, JavaScript, HTML/CSS, Responsive Design, UI/UX Design, Node.js, Git, Databases, Tailwind CSS, GitHub, CLI.
- Services: Frontend Development, Responsive Web Design, UI/UX Refinement, Mobile Experience.
- Featured projects: E-Commerce Platform, Weather Dashboard, Task Manager, Portfolio Website.
- CV: Visitors can click Download CV in the navigation or hero section.

If a visitor wants to hire or collaborate with Ivar, encourage them to use the contact section or email ivarhinisan@email.com.`

function parseMessages(body: unknown): ChatMessage[] {
  if (!body || typeof body !== 'object') return []

  const messages = (body as { messages?: unknown }).messages

  if (!Array.isArray(messages)) return []

  return messages
    .filter((message): message is ChatMessage => {
      if (!message || typeof message !== 'object') return false

      const { role, content } = message as Partial<ChatMessage>

      return (
        (role === 'user' || role === 'assistant') &&
        typeof content === 'string' &&
        content.trim().length > 0
      )
    })
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 1000),
    }))
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS')
    return res.status(204).json({})
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY environment variable' })
  }

  const messages = parseMessages(req.body)

  if (messages.length === 0) {
    return res.status(400).json({ error: 'Please send at least one message.' })
  }

  try {
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.45,
        max_tokens: 220,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    })

    const data = await openAiResponse.json()

    if (!openAiResponse.ok) {
      console.error('OpenAI API error:', data)
      return res.status(502).json({
        error: 'The assistant is temporarily unavailable. Please try again shortly.',
      })
    }

    const reply = data?.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      return res.status(502).json({ error: 'The assistant returned an empty response.' })
    }

    return res.status(200).json({ reply })
  } catch (error) {
    console.error('Chat route error:', error)
    return res.status(500).json({
      error: 'Something went wrong while contacting the assistant.',
    })
  }
}
