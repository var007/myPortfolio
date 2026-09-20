export const PROJECT_CATEGORIES = ['Web', 'Mobile', 'Desktop', 'API / Backend', 'Full Stack'] as const
export const PROJECT_STATUSES = ['Published', 'Draft', 'In Progress', 'Archived', 'Hidden'] as const
export type ProjectStatus = typeof PROJECT_STATUSES[number]

/** Optional extensions keep existing portfolio data and seeds compatible. */
export interface CmsMeta {
  status?: ProjectStatus
  featured?: boolean
  visible?: boolean
  order?: number
  completion?: number
  proficiency?: number
  slug?: string
  category?: string
  projectType?: string
  fullDescription?: string
  cover?: string
  screenshots?: string[]
  demo?: string
  backend?: string
  documentation?: string
  overview?: string
  purpose?: string
  role?: string
  challenges?: string
  solution?: string
  outcome?: string
  client?: string
  year?: string
  duration?: string
  featureDetails?: { title: string; description: string }[]
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
  photo?: string
  resume?: string
  resumeName?: string
  bio?: string
  website?: string
  instagram?: string
  twitter?: string
  title?: string
  introduction?: string
  education?: string[]
  experience?: string[]
  achievements?: string[]
  features?: string[]
  availability?: string
  formEnabled?: boolean
}

export interface SiteSettings {
  portfolioName?: string
  timezone?: string
  showProjects?: boolean
  showSkills?: boolean
  showServices?: boolean
  showContact?: boolean
  siteTitle?: string
  siteDescription?: string
  keywords?: string
  socialImage?: string
}

export function safeUrl(value: string, allowRelative = false): boolean {
  if (!value) return true
  if (allowRelative && /^\/(?!\/)/.test(value)) return true
  try { return ['https:', 'http:'].includes(new URL(value).protocol) } catch { return false }
}

export function validateMeta(value: unknown): void {
  if (value === undefined) return
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid content metadata.')
  const record = value as Record<string, unknown>
  const booleans = ['featured', 'visible', 'formEnabled']
  const numbers = ['order', 'completion', 'proficiency']
  const arrays = ['screenshots', 'education', 'experience', 'achievements', 'features']
  const links = ['cover', 'demo', 'backend', 'documentation', 'photo', 'resume', 'website', 'instagram', 'twitter']
  for (const [key, item] of Object.entries(record)) {
    if (booleans.includes(key)) {
      if (typeof item !== 'boolean') throw new Error(`Invalid ${key}.`)
    } else if (numbers.includes(key)) {
      if (typeof item !== 'number' || !Number.isFinite(item) || item < 0 || (key !== 'order' && item > 100)) throw new Error(`Invalid ${key}.`)
    } else if (arrays.includes(key)) {
      if (!Array.isArray(item) || !item.every((s) => typeof s === 'string' && (key !== 'screenshots' || safeUrl(s, true)))) throw new Error(`Invalid ${key}.`)
    } else if (key === 'featureDetails') {
      if (!Array.isArray(item) || !item.every((f) => f && typeof f.title === 'string' && typeof f.description === 'string')) throw new Error('Invalid feature details.')
    } else if (typeof item !== 'string' || item.length > 30000 || (links.includes(key) && !safeUrl(item, true))) throw new Error(`Invalid ${key}.`)
  }
  if (record.status && !PROJECT_STATUSES.includes(record.status as ProjectStatus)) throw new Error('Invalid publishing status.')
}

export function validateSettings(value: unknown): void {
  if (value === undefined) return
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid settings.')
  for (const [key, item] of Object.entries(value)) {
    if (key.startsWith('show') ? typeof item !== 'boolean' : typeof item !== 'string') throw new Error(`Invalid setting: ${key}`)
  }
  const settings = value as SiteSettings
  if (settings.socialImage && !safeUrl(settings.socialImage, true)) throw new Error('Invalid social image URL.')
  if (settings.timezone) { try { new Intl.DateTimeFormat('en', { timeZone: settings.timezone }) } catch { throw new Error('Invalid timezone.') } }
}
