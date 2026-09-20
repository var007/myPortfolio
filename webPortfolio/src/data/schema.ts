import { safeUrl, validateMeta, validateSettings } from './cms.js'
import type { CmsMeta, SiteSettings } from './cms.js'
export type IconKey =
  | 'code2'
  | 'database'
  | 'gitbranch'
  | 'layout'
  | 'palette'
  | 'server'
  | 'smartphone'
  | 'terminal'

export type SkillIllustration =
  | 'atom'
  | 'code'
  | 'cube'
  | 'ui'
  | 'server'
  | 'graph'
  | 'database'
  | 'terminal'
  | 'mobile'
  | 'design'

export type SkillCategory = 'Frontend' | 'Language' | 'Styling' | 'Backend' | 'Workflow' | 'Design' | 'Database' | 'Mobile' | 'DevOps' | 'Tools' | 'Other'

export type ServiceVariant = 'large-tall' | 'medium-tall' | 'wide' | 'bottom'

export interface ProfileContent {
  meta?: CmsMeta
  name: string
  role: string
  location: string
}

export interface AboutStat {
  number: string
  label: string
}

export interface AboutContent {
  meta?: CmsMeta
  bio: string[]
  stats: AboutStat[]
}

export interface ContactSocials {
  github: string
  linkedin: string
  facebook: string
}

export interface ContactContent {
  meta?: CmsMeta
  email: string
  phone: string
  location: string
  socials: ContactSocials
}

export interface ProjectContent {
  meta?: CmsMeta
  title: string
  description: string
  tags: string[]
  features: string[]
  github: string
  live: string
  image: string
  imageAlt: string
}

export interface SkillContent {
  meta?: CmsMeta
  id: string
  name: string
  description: string
  icon: IconKey
  logo: string
  illustration: SkillIllustration
  category: SkillCategory
}

export interface ServiceContent {
  meta?: CmsMeta
  id: string
  title: string
  desc: string
  expandedDesc: string
  icon: IconKey
  variant: ServiceVariant
}

export interface ContentData {
  settings?: SiteSettings
  profile: ProfileContent
  about: AboutContent
  contact: ContactContent
  projects: ProjectContent[]
  skills: SkillContent[]
  services: ServiceContent[]
}

export const ICON_KEYS: IconKey[] = [
  'code2',
  'database',
  'gitbranch',
  'layout',
  'palette',
  'server',
  'smartphone',
  'terminal',
]

export const SKILL_ILLUSTRATIONS: SkillIllustration[] = [
  'atom',
  'code',
  'cube',
  'ui',
  'server',
  'graph',
  'database',
  'terminal',
  'mobile',
  'design',
]

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Database', 'Mobile', 'DevOps', 'Tools', 'Other',
  'Frontend',
  'Language',
  'Styling',
  'Backend',
  'Workflow',
  'Design',
]

export const SERVICE_VARIANTS: ServiceVariant[] = ['large-tall', 'medium-tall', 'wide', 'bottom']

export function defaultContent(): ContentData {
  return {
    profile: { name: '', role: '', location: '' },
    about: { bio: [], stats: [] },
    contact: { email: '', phone: '', location: '', socials: { github: '', linkedin: '', facebook: '' } },
    projects: [],
    skills: [],
    services: [],
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString)
}

function isIconKey(value: unknown): value is IconKey {
  return isString(value) && (ICON_KEYS as string[]).includes(value)
}

function isIllustration(value: unknown): value is SkillIllustration {
  return isString(value) && (SKILL_ILLUSTRATIONS as string[]).includes(value)
}

function isCategory(value: unknown): value is SkillCategory {
  return isString(value) && (SKILL_CATEGORIES as string[]).includes(value)
}

function isVariant(value: unknown): value is ServiceVariant {
  return isString(value) && (SERVICE_VARIANTS as string[]).includes(value)
}

function isStat(value: unknown): value is AboutStat {
  return isRecord(value) && isString(value.number) && isString(value.label)
}

function isProject(value: unknown): value is ProjectContent {
  return (
    isRecord(value) &&
    isString(value.title) &&
    isString(value.description) &&
    isStringArray(value.tags) &&
    isStringArray(value.features) &&
    isString(value.github) &&
    isString(value.live) &&
    isString(value.image) &&
    isString(value.imageAlt) &&
    safeUrl(value.github as string) &&
    safeUrl(value.live as string) &&
    safeUrl(value.image as string, true)
  )
}

function isSkill(value: unknown): value is SkillContent {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.name) &&
    isString(value.description) &&
    isIconKey(value.icon) &&
    isString(value.logo) &&
    isIllustration(value.illustration) &&
    isCategory(value.category)
  )
}

function isService(value: unknown): value is ServiceContent {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.title) &&
    isString(value.desc) &&
    isString(value.expandedDesc) &&
    isIconKey(value.icon) &&
    isVariant(value.variant)
  )
}

/**
 * Validates raw JSON against the content schema. Returns the normalized
 * content when valid, otherwise throws an Error describing the problem.
 * Shared by the site loader and the save endpoint.
 */
export function validateContent(raw: unknown): ContentData {
  if (!isRecord(raw)) {
    throw new Error('Content root must be an object.')
  }

  const errors: string[] = []

  if (!isRecord(raw.profile)) errors.push('"profile" must be an object.')
  if (!isRecord(raw.about)) errors.push('"about" must be an object.')
  if (!isRecord(raw.contact)) errors.push('"contact" must be an object.')
  if (!Array.isArray(raw.projects)) errors.push('"projects" must be an array.')
  if (!Array.isArray(raw.skills)) errors.push('"skills" must be an array.')
  if (!Array.isArray(raw.services)) errors.push('"services" must be an array.')

  if (errors.length > 0) throw new Error(errors.join(' '))

  const profile = raw.profile as Record<string, unknown>
  if (!isString(profile.name) || !isString(profile.role) || !isString(profile.location)) {
    errors.push('"profile" requires string fields: name, role, location.')
  }

  const about = raw.about as Record<string, unknown>
  if (!isStringArray(about.bio)) errors.push('"about.bio" must be an array of strings.')
  if (!Array.isArray(about.stats) || !about.stats.every(isStat)) {
    errors.push('"about.stats" must be an array of { number, label }.')
  }

  const contact = raw.contact as Record<string, unknown>
  if (!isString(contact.email) || !isString(contact.phone) || !isString(contact.location)) {
    errors.push('"contact" requires string fields: email, phone, location.')
  }
  if (
    !isRecord(contact.socials) ||
    !isString(contact.socials.github) ||
    !isString(contact.socials.linkedin) ||
    !isString(contact.socials.facebook)
  ) {
    errors.push('"contact.socials" requires string fields: github, linkedin, facebook.')
  }

  const projects = raw.projects as unknown[]
  if (!projects.every(isProject)) {
    errors.push('Every project requires: title, description, tags, features, github, live, image, imageAlt.')
  }

  const skills = raw.skills as unknown[]
  if (!skills.every(isSkill)) {
    errors.push('Every skill requires: id, name, description, icon, logo, illustration, category.')
  }

  const services = raw.services as unknown[]
  if (!services.every(isService)) {
    errors.push('Every service requires: id, title, desc, expandedDesc, icon, variant.')
  }

  if (errors.length > 0) throw new Error(errors.join(' '))

  for (const section of [profile, about, contact, ...projects, ...skills, ...services]) validateMeta((section as { meta?: unknown }).meta)
  validateSettings(raw.settings)
  return {
    ...(raw.settings ? { settings: raw.settings as SiteSettings } : {}),
    profile: profile as unknown as ProfileContent,
    about: about as unknown as AboutContent,
    contact: contact as unknown as ContactContent,
    projects: projects as ProjectContent[],
    skills: skills as SkillContent[],
    services: services as ServiceContent[],
  }
}
