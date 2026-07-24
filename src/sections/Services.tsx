import { useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Code2, Layout, Palette, Smartphone } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import SectionSideLabel from '../components/SectionSideLabel'

type ServiceId = 'frontend' | 'responsive' | 'uiux' | 'mobile'
type ServiceVariant = 'large-tall' | 'medium-tall' | 'wide' | 'bottom'

interface Service {
  id: ServiceId
  title: string
  desc: string
  expandedDesc: string
  icon: LucideIcon
  variant: ServiceVariant
}

type ServiceCardStyle = CSSProperties & {
  '--service-delay': string
}

const services: Service[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    desc: 'Clean, responsive interfaces built with modern React, TypeScript, and maintainable component patterns.',
    expandedDesc: 'Building scalable frontend applications using React, TypeScript, reusable component architecture, performance optimization, and modern UI systems.',
    icon: Code2,
    variant: 'large-tall',
  },
  {
    id: 'responsive',
    title: 'Responsive Web Design',
    desc: 'Layouts that feel balanced and polished across desktop, tablet, and mobile screen sizes.',
    expandedDesc: 'Designing fluid page systems with intentional breakpoints, readable spacing, touch-friendly structure, and polished experiences across desktop, tablet, and mobile.',
    icon: Layout,
    variant: 'medium-tall',
  },
  {
    id: 'uiux',
    title: 'UI/UX Refinement',
    desc: 'Thoughtful interaction details, readable typography, and visual systems that make products easier to use.',
    expandedDesc: 'Refining typography, interaction details, hierarchy, accessibility, and visual systems so digital products feel easier, cleaner, and more premium to use.',
    icon: Palette,
    variant: 'wide',
  },
  {
    id: 'mobile',
    title: 'Mobile Experience',
    desc: 'Touch-friendly flows and adaptive screens for web and mobile-focused user experiences.',
    expandedDesc: 'Creating compact, thumb-friendly interfaces with responsive flows, clean information density, smooth feedback, and reliable mobile-first interaction patterns.',
    icon: Smartphone,
    variant: 'bottom',
  },
]

function serviceCardStyle(index: number): ServiceCardStyle {
  return {
    '--service-delay': `${index * 120}ms`,
  }
}

function ServicesHeader() {
  const [ref, inView] = useInView<HTMLDivElement>(0.18)

  return (
    <div ref={ref} className={`services-heading${inView ? ' in-view' : ''}`}>
      <h2 id="services-heading" className="services-heading-title">
        What I Can <span>Help Build</span>
      </h2>
      <p className="services-heading-text">
        Focused frontend services for polished digital experiences.
      </p>
    </div>
  )
}

function ServiceIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="service-card-icon" aria-hidden="true">
      <Icon />
    </div>
  )
}

interface ServiceCardProps {
  service: Service
  index: number
  inView: boolean
  activeService: ServiceId | null
  setActiveService: (id: ServiceId | null) => void
}

function ServiceCard({ service, index, inView, activeService, setActiveService }: ServiceCardProps) {
  const isActive = activeService === service.id

  function toggleActiveService() {
    setActiveService(isActive ? null : service.id)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleActiveService()
    }
  }

  return (
    <article
      className={`service-card service-card-${service.variant}${inView ? ' in-view' : ''}${isActive ? ' is-active' : ''}`}
      style={serviceCardStyle(index)}
      tabIndex={0}
      role="button"
      aria-expanded={isActive}
      aria-label={`${service.title}. ${service.desc}`}
      onClick={toggleActiveService}
      onKeyDown={handleKeyDown}
    >
      <ServiceIcon icon={service.icon} />
      <div className="service-card-copy">
        <h3>{service.title}</h3>
        <span className="service-card-divider" aria-hidden="true" />
        <div className="service-card-text">
          <p className="service-card-description">{service.desc}</p>
          <p className="service-card-expanded">{service.expandedDesc}</p>
        </div>
      </div>
    </article>
  )
}

function ServicesGrid() {
  const [ref, inView] = useInView<HTMLDivElement>(0.16)
  const [activeService, setActiveService] = useState<ServiceId | null>(null)
  const gridClassName = `services-grid${inView ? ' in-view' : ''}${activeService ? ' has-active' : ''}`

  return (
    <div ref={ref} className={gridClassName} aria-label="Frontend services">
      {services.map((service, index) => (
        <ServiceCard
          key={service.id}
          service={service}
          index={index}
          inView={inView}
          activeService={activeService}
          setActiveService={setActiveService}
        />
      ))}
    </div>
  )
}

export default function ServicesSection() {
  return (
    <section id="services" className="section services-section" aria-labelledby="services-heading">
      <div className="section-inner section-with-side-label">
        <SectionSideLabel label="Services" />

        <ServicesHeader />
        <ServicesGrid />
      </div>
    </section>
  )
}
