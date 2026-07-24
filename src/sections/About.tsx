import type { CSSProperties } from 'react'
import { useInView } from '../hooks/useInView'
import myPhoto from '../assets/my-photo.png'
import SectionSideLabel from '../components/SectionSideLabel'

const stats = [
  { number: '1+', label: 'Years Experience' },
  { number: '10+', label: 'Projects Completed' },
  { number: '5+', label: 'Technologies Mastered' },
  { number: '3+', label: 'Happy Clients' },
] as const

type StatStyle = CSSProperties & {
  '--stat-delay': string
}

function statStyle(index: number): StatStyle {
  return {
    '--stat-delay': `${index * 100}ms`,
  }
}

export default function About() {
  const [sectionRef, sectionInView] = useInView<HTMLElement>(0.08)

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section section-alt about-section"
      aria-labelledby="about-heading"
    >
      <div className="section-inner section-with-side-label about-section-inner">
        <SectionSideLabel label="About Me" />

        <div className="about-grid">
          <div className={`about-image-col about-image-motion${sectionInView ? ' in-view' : ''}`}>
            <figure className="about-portrait-stage">
              <span className="about-panel about-panel-back" aria-hidden="true" />
              <span className="about-panel about-panel-offset" aria-hidden="true" />
              <span className="about-accent-line" aria-hidden="true" />
              <span className="about-dot-pattern" aria-hidden="true" />
              <span className="about-guide-line" aria-hidden="true" />

              <div className="about-image-frame">
                <img
                  src={myPhoto}
                  alt="Portrait of Ivar Hinisan"
                  className="about-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </figure>
          </div>

          <div className={`about-text-col about-content-motion${sectionInView ? ' in-view' : ''}`}>
            <h2 id="about-heading" className="about-heading">
              <span className="about-heading-line">Crafting Digital</span>
              <span className="about-heading-line">Experiences That Make</span>
              <span className="about-heading-line">
                an <span className="about-heading-impact">Impact.</span>
              </span>
            </h2>
            <div className="about-text">
              <p>
                I'm an IT student and frontend developer who is passionate about building
                clean, modern, and user-friendly interfaces. I enjoy turning ideas into
                real-world solutions through code and design.
              </p>
              <p>
                I continuously explore new technologies and improve my skills to deliver
                experiences that are not only functional but also polished and enjoyable to use.
              </p>
            </div>

            <div
              className={`stats-grid about-stats-grid${sectionInView ? ' in-view' : ''}`}
            >
              {stats.map((stat, i) => (
                <article key={stat.label} className="stat-card about-stat-card" style={statStyle(i)}>
                  <p className="stat-card-number">{stat.number}</p>
                  <p className="stat-card-label">{stat.label}</p>
                  <span className="stat-card-divider" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
