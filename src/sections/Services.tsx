import { Code2, Layout, Palette, Smartphone } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import SectionHeading from '../components/SectionHeading'
import { motionClass, motionStyle } from '../utils/motion'

const services = [
  {
    title: 'Frontend Development',
    desc: 'Clean, responsive interfaces built with modern React, TypeScript, and maintainable component patterns.',
    icon: Code2,
  },
  {
    title: 'Responsive Web Design',
    desc: 'Layouts that feel balanced and polished across desktop, tablet, and mobile screen sizes.',
    icon: Layout,
  },
  {
    title: 'UI/UX Refinement',
    desc: 'Thoughtful interaction details, readable typography, and visual systems that make products easier to use.',
    icon: Palette,
  },
  {
    title: 'Mobile Experience',
    desc: 'Touch-friendly flows and adaptive screens for web and mobile-focused user experiences.',
    icon: Smartphone,
  },
]

export default function Services() {
  const [ref, inView] = useInView()

  return (
    <section id="services" className="section">
      <div className="section-inner">
        <SectionHeading
          title="What I Can Help Build"
          text="Focused frontend services for polished digital experiences."
          centered
        />

        <div ref={ref} className="services-grid">
          {services.map((service, i) => {
            const Icon = service.icon

            return (
              <article
                key={service.title}
                className={motionClass('service-card', inView, 'from-bottom')}
                style={motionStyle(i, 100)}
              >
                <div className="service-card-icon">
                  <Icon aria-hidden="true" />
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
