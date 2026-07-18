import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { useInView } from '../hooks/useInView'
import SectionHeading from '../components/SectionHeading'
import projectFallbackImage from '../assets/hero.png'

type ProjectCardStyle = CSSProperties & {
  '--project-image': string
}

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const projects = [
  {
    title: 'E-Commerce Platform',
    desc: 'A modern e-commerce application with product catalog, cart functionality, and responsive design built with React and TypeScript.',
    tags: ['React', 'TypeScript', 'Node.js'],
    github: 'https://github.com/ivarhinisan',
    live: 'https://example.com',
    image: projectFallbackImage,
  },
  {
    title: 'Weather Dashboard',
    desc: 'Real-time weather application with interactive maps, forecasts, and location-based data using OpenWeather API.',
    tags: ['React', 'API', 'CSS'],
    github: 'https://github.com/ivarhinisan',
    live: 'https://example.com',
    image: projectFallbackImage,
  },
  {
    title: 'Task Manager',
    desc: 'A full-stack task management application featuring drag-and-drop, real-time updates, and team collaboration tools.',
    tags: ['React', 'Node.js', 'MongoDB'],
    github: 'https://github.com/ivarhinisan',
    live: 'https://example.com',
    image: projectFallbackImage,
  },
  {
    title: 'Portfolio Website',
    desc: 'A premium personal portfolio showcasing projects, skills, and experience with a clean and modern design.',
    tags: ['React', 'TypeScript', 'CSS'],
    github: 'https://github.com/ivarhinisan',
    live: 'https://example.com',
    image: projectFallbackImage,
  },
]

const carouselProjects = [...projects, ...projects]

const carouselDuration = 22
const manualStepSeconds = carouselDuration / projects.length

function normalizeAnimationDelay(delay: number) {
  let nextDelay = delay

  while (nextDelay > 0) {
    nextDelay -= carouselDuration
  }

  while (nextDelay <= -carouselDuration) {
    nextDelay += carouselDuration
  }

  return nextDelay
}

export default function Projects() {
  const [ref, inView] = useInView()
  const trackRef = useRef<HTMLDivElement>(null)

  function moveCarousel(direction: 'previous' | 'next') {
    const track = trackRef.current

    if (!track) return

    const currentDelay = parseFloat(window.getComputedStyle(track).animationDelay) || 0
    const movement = direction === 'next' ? -manualStepSeconds : manualStepSeconds
    const nextDelay = normalizeAnimationDelay(currentDelay + movement)

    track.style.animationDelay = `${nextDelay}s`
  }

  return (
    <section id="projects" className="section section-alt">
      <div className="section-inner">
        <SectionHeading
          title="Featured Work"
          text="A selection of projects I've built over the years."
          centered
        />

        <div
          ref={ref}
          className={`projects-carousel reveal${inView ? ' in-view' : ''}`}
        >
          <div className="projects-carousel-viewport" role="region" aria-label="Featured project carousel">
            <div ref={trackRef} className="projects-carousel-track">
              {carouselProjects.map((project, i) => {
                const isDuplicate = i >= projects.length
                const cardStyle: ProjectCardStyle = {
                  '--project-image': `url(${project.image})`,
                }

                return (
                  <article
                    key={`${project.title}-${i}`}
                    className="project-card"
                    style={cardStyle}
                    aria-hidden={isDuplicate}
                  >
                    <div className="project-card-content">
                      <div className="project-card-tags">
                        {project.tags.map((tag) => (
                          <span key={tag} className="project-card-tag">{tag}</span>
                        ))}
                      </div>
                      <h3 className="project-card-title">{project.title}</h3>
                      <p className="project-card-desc">{project.desc}</p>
                      <div className="project-card-links">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={isDuplicate ? -1 : undefined}
                        >
                          <GitHubIcon />
                          Source
                        </a>
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={isDuplicate ? -1 : undefined}
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="projects-carousel-controls" aria-label="Project carousel controls">
            <button
              type="button"
              className="project-carousel-control"
              aria-label="Show previous project"
              onClick={() => moveCarousel('previous')}
            >
              <ChevronLeft size={19} />
            </button>
            <button
              type="button"
              className="project-carousel-control"
              aria-label="Show next project"
              onClick={() => moveCarousel('next')}
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
