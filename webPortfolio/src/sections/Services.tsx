import { useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { useInView } from '../hooks/useInView'
import SectionSideLabel from '../components/SectionSideLabel'
import { useContent } from '../data/useContent'
import { ICON_MAP } from '../data/content'
import type { ServiceContent } from '../data/schema'

type Service = ServiceContent

type ServiceCardStyle = CSSProperties & {
  '--service-delay': string
}

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

function ServiceIcon({ icon }: { icon: ServiceContent['icon'] }) {
  const Icon = ICON_MAP[icon]

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
  activeService: string | null
  setActiveService: (id: string | null) => void
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
  const [activeService, setActiveService] = useState<string | null>(null)
  const { content } = useContent()
  const services: Service[] = content.services
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
