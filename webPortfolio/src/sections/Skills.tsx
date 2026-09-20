import { memo, useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'
import SectionHeading from '../components/SectionHeading'
import SectionSideLabel from '../components/SectionSideLabel'
import { useContent } from '../data/useContent'
import { ICON_MAP } from '../data/content'
import type { SkillContent, SkillIllustration } from '../data/schema'

type BentoSize = 'large' | 'small' | 'medium' | 'wide'

type Skill = SkillContent

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

function createVisibleSlots(skills: Skill[], startIndex = 0): VisibleSkillSlot[] {
  if (skills.length === 0) return []

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
  const Icon = ICON_MAP[skill.icon]

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

function BentoGrid({ skills }: { skills: Skill[] }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.16)
  const [visibleSlots, setVisibleSlots] = useState<VisibleSkillSlot[]>(() => createVisibleSlots(skills))
  const visibleSlotsRef = useRef(visibleSlots)
  const groupStartRef = useRef(0)
  const crossfadeTimeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    visibleSlotsRef.current = visibleSlots
  }, [visibleSlots])

  useEffect(() => {
    if (skills.length === 0) return

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
  }, [skills])

  if (skills.length === 0) {
    return null
  }

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
  const { content } = useContent()
  const skillsKey = content.skills.map((skill) => skill.id).join('|')

  return (
    <section id="skills" className="section skills-section">
      <div className="section-inner section-with-side-label">
        <SectionSideLabel label="Skills" />

        <SectionHeading
          title="Technologies & Tools"
          text="The tools and technologies I use to bring ideas to life and build modern, high-quality digital experiences."
          centered
        />

        <BentoGrid key={skillsKey} skills={content.skills} />
      </div>
    </section>
  )
}
