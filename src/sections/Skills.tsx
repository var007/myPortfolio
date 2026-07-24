import { memo, useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
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
import { useInView } from '../hooks/useInView'
import SectionHeading from '../components/SectionHeading'
import SectionSideLabel from '../components/SectionSideLabel'

type SkillCategory = 'Frontend' | 'Language' | 'Styling' | 'Backend' | 'Workflow' | 'Design'
type SkillIllustration = 'atom' | 'code' | 'cube' | 'ui' | 'server' | 'graph' | 'database' | 'terminal' | 'mobile' | 'design'
type BentoSize = 'large' | 'small' | 'medium' | 'wide'

interface Skill {
  id: string
  name: string
  description: string
  icon: LucideIcon
  logo: string
  illustration: SkillIllustration
  category: SkillCategory
}

interface VisibleSkillSlot {
  id: string
  size: BentoSize
  current: Skill
  previous?: Skill
  isCrossfading: boolean
}

interface BentoSlot {
  id: string
  size: BentoSize
}

interface SkillCardProps {
  slot: VisibleSkillSlot
}

interface AnimatedSkillContentProps {
  skill: Skill
  state: 'active' | 'entering' | 'exiting'
}

const ROTATION_INTERVAL_MS = 3000
const CROSSFADE_DURATION_MS = 6000
const VISIBLE_SKILL_COUNT = 6

const bentoSlots: BentoSlot[] = [
  { id: 'skill-slot-1', size: 'large' },
  { id: 'skill-slot-2', size: 'small' },
  { id: 'skill-slot-3', size: 'medium' },
  { id: 'skill-slot-4', size: 'large' },
  { id: 'skill-slot-5', size: 'wide' },
  { id: 'skill-slot-6', size: 'small' },
]

const skills: Skill[] = [
  {
    id: 'react',
    name: 'React',
    description: 'Building interactive and reusable user interfaces with modern component architecture.',
    icon: Code2,
    logo: 'React',
    illustration: 'atom',
    category: 'Frontend',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'Designing safer frontend systems with typed data models, reusable interfaces, and predictable code.',
    icon: Code2,
    logo: 'TS',
    illustration: 'code',
    category: 'Language',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Creating expressive browser experiences with clean logic, async flows, and polished interactions.',
    icon: Terminal,
    logo: 'JS',
    illustration: 'cube',
    category: 'Language',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    description: 'Crafting consistent, responsive interfaces through utility-first styling and scalable design tokens.',
    icon: Palette,
    logo: 'TW',
    illustration: 'ui',
    category: 'Styling',
  },
  {
    id: 'node',
    name: 'Node.js',
    description: 'Connecting frontend experiences to lightweight APIs, server logic, and real-world application workflows.',
    icon: Server,
    logo: 'Node',
    illustration: 'server',
    category: 'Backend',
  },
  {
    id: 'git',
    name: 'Git',
    description: 'Managing clean version history, branching workflows, and collaborative development practices.',
    icon: GitBranch,
    logo: 'Git',
    illustration: 'graph',
    category: 'Workflow',
  },
  {
    id: 'next',
    name: 'Next.js',
    description: 'Structuring fast React applications with production-minded routing, rendering, and deployment patterns.',
    icon: Layout,
    logo: 'Next',
    illustration: 'ui',
    category: 'Frontend',
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Translating ideas into refined visual systems, prototypes, and developer-ready interface details.',
    icon: Palette,
    logo: 'Figma',
    illustration: 'design',
    category: 'Design',
  },
  {
    id: 'database',
    name: 'Databases',
    description: 'Modeling application data with practical schemas, CRUD workflows, and reliable persistence patterns.',
    icon: Database,
    logo: 'DB',
    illustration: 'database',
    category: 'Backend',
  },
  {
    id: 'responsive',
    name: 'Responsive UI',
    description: 'Designing adaptive layouts that feel intentional across desktop, tablet, and mobile screens.',
    icon: Smartphone,
    logo: 'UI',
    illustration: 'mobile',
    category: 'Frontend',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Maintaining project repositories with clear commits, pull requests, and organized delivery workflows.',
    icon: GitBranch,
    logo: 'GH',
    illustration: 'graph',
    category: 'Workflow',
  },
  {
    id: 'cli',
    name: 'CLI',
    description: 'Using command-line tooling to run builds, debug issues, manage packages, and automate development tasks.',
    icon: Terminal,
    logo: 'CLI',
    illustration: 'terminal',
    category: 'Workflow',
  },
]

function createVisibleSlots(startIndex = 0): VisibleSkillSlot[] {
  return bentoSlots.map((slot, index) => ({
    ...slot,
    current: skills[(startIndex + index) % skills.length],
    isCrossfading: false,
  }))
}

function SkillIllustration({ illustration }: { illustration: SkillIllustration }) {
  return (
    <div className={`skill-illustration skill-illustration-${illustration}`} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
  )
}

function AnimatedSkillContent({ skill, state }: AnimatedSkillContentProps) {
  const Icon = skill.icon

  return (
    <div
      className={`skill-bento-content skill-bento-content-${state}`}
      aria-hidden={state === 'exiting'}
    >
      <SkillIllustration illustration={skill.illustration} />
      <div className="skill-bento-visual" aria-hidden="true">
        <div className="skill-bento-icon">
          <Icon />
        </div>
        <div className={`skill-logo-badge skill-logo-${skill.id}`}>
          <span>{skill.logo}</span>
        </div>
      </div>
      <div className="skill-bento-copy">
        <p className="skill-bento-category">{skill.category}</p>
        <h3 className="skill-bento-name">{skill.name}</h3>
        <p className="skill-bento-description">{skill.description}</p>
      </div>
    </div>
  )
}

const SkillCard = memo(function SkillCard({ slot }: SkillCardProps) {
  const contentState = slot.isCrossfading ? 'entering' : 'active'

  return (
    <article
      className={`skill-bento-card skill-bento-card-${slot.size}`}
      tabIndex={0}
      aria-label={`${slot.current.name}. ${slot.current.description}`}
    >
      <div className="skill-bento-glow" aria-hidden="true" />
      <div className="skill-bento-content-shell">
        {slot.previous && (
          <AnimatedSkillContent
            key={`${slot.id}-${slot.previous.id}-previous`}
            skill={slot.previous}
            state="exiting"
          />
        )}
        <AnimatedSkillContent
          key={`${slot.id}-${slot.current.id}-current`}
          skill={slot.current}
          state={contentState}
        />
      </div>
    </article>
  )
})

function BentoGrid() {
  const [ref, inView] = useInView<HTMLDivElement>(0.16)
  const [visibleSlots, setVisibleSlots] = useState(createVisibleSlots)
  const visibleSlotsRef = useRef(visibleSlots)
  const groupStartRef = useRef(0)
  const crossfadeTimeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    visibleSlotsRef.current = visibleSlots
  }, [visibleSlots])

  useEffect(() => {
    const interval = window.setInterval(() => {
      const currentSlots = visibleSlotsRef.current
      const nextGroupStart = (groupStartRef.current + VISIBLE_SKILL_COUNT) % skills.length
      const nextSlots = currentSlots.map((slot, index) => ({
        ...slot,
        current: skills[(nextGroupStart + index) % skills.length],
        previous: slot.current,
        isCrossfading: true,
      }))

      groupStartRef.current = nextGroupStart

      visibleSlotsRef.current = nextSlots
      setVisibleSlots(nextSlots)
      window.clearTimeout(crossfadeTimeoutRef.current)
      crossfadeTimeoutRef.current = window.setTimeout(() => {
        const settledSlots = visibleSlotsRef.current.map((slot) => {
          if (!slot.previous) return slot

          return {
            ...slot,
            previous: undefined,
            isCrossfading: false,
          }
        })

        visibleSlotsRef.current = settledSlots
        setVisibleSlots(settledSlots)
      }, CROSSFADE_DURATION_MS)
    }, ROTATION_INTERVAL_MS)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(crossfadeTimeoutRef.current)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`skills-bento-grid reveal${inView ? ' in-view' : ''}`}
      aria-label="Rotating technologies and tools"
    >
      {visibleSlots.slice(0, VISIBLE_SKILL_COUNT).map((slot) => (
        <SkillCard key={slot.id} slot={slot} />
      ))}
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="section skills-section">
      <div className="section-inner section-with-side-label">
        <SectionSideLabel label="Skills" />

        <SectionHeading
          title="Technologies & Tools"
          text="The tools and technologies I use to bring ideas to life and build modern, high-quality digital experiences."
          centered
        />

        <BentoGrid />
      </div>
    </section>
  )
}
