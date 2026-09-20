import type { CSSProperties } from 'react'
import { useInView } from '../hooks/useInView'
import myPhoto from '../assets/my-photo.png'
import SectionSideLabel from '../components/SectionSideLabel'
import { useContent } from '../data/useContent'

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
  const { content } = useContent()

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
                  src={content.profile.meta?.photo || myPhoto}
                  alt={`Portrait of ${content.profile.name}`}
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
              {content.about.bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div
              className={`stats-grid about-stats-grid${sectionInView ? ' in-view' : ''}`}
            >
              {content.about.stats.map((stat, i) => (
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
