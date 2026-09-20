import type { LucideIcon } from 'lucide-react'
import fallbackJson from '../../data/content.json'
import {
  Code2,
  Database,
  GitBranch,
  Layout,
  Palette,
  Server,
  Smartphone,
  Terminal,
} from 'lucide-react'
import { validateContent } from './schema'
import type { ContentData, IconKey } from './schema'

export const ICON_MAP: Record<IconKey, LucideIcon> = {
  code2: Code2,
  database: Database,
  gitbranch: GitBranch,
  layout: Layout,
  palette: Palette,
  server: Server,
  smartphone: Smartphone,
  terminal: Terminal,
}

function publicContent(content: ContentData): ContentData {
  return {
    ...content,
    projects: content.settings?.showProjects === false ? [] : content.projects
      .filter((project) => project.meta?.visible !== false && (!project.meta?.status || project.meta.status === 'Published'))
      .sort((a, b) => Number(Boolean(b.meta?.featured)) - Number(Boolean(a.meta?.featured)) || (a.meta?.order ?? 0) - (b.meta?.order ?? 0)),
    skills: content.settings?.showSkills === false ? [] : content.skills
      .filter((skill) => skill.meta?.visible !== false)
      .sort((a, b) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0)),
    services: content.settings?.showServices === false ? [] : content.services
      .filter((service) => service.meta?.visible !== false && !['Draft', 'Hidden', 'Archived'].includes(service.meta?.status ?? ''))
      .sort((a, b) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0)),
  }
}

export const portfolioContent = publicContent(validateContent(fallbackJson))
