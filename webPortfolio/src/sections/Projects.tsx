import { ArrowDown, Check, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import type { CSSProperties, TransitionEvent } from 'react'
import { useInView } from '../hooks/useInView'
import SectionHeading from '../components/SectionHeading'
import SectionSideLabel from '../components/SectionSideLabel'
import projectFallbackImage from '../assets/hero.png'
import { useContent } from '../data/useContent'
import type { ProjectContent } from '../data/schema'

type Project = ProjectContent

type FeatureStyle = CSSProperties & {
  '--feature-delay': string
}

const INITIAL_PROJECT_COUNT = 3

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

function featureStyle(index: number): FeatureStyle {
  return {
    '--feature-delay': `${index * 70}ms`,
  }
}

interface ProjectInfoProps {
  project: Project
  isInteractive: boolean
}

function ProjectInfo({ project, isInteractive }: ProjectInfoProps) {
  const tabIndex = isInteractive ? undefined : -1

  return (
    <div className="project-info">
      <div className="project-tech-list" aria-label={`${project.title} technologies`}>
        {project.tags.map((tag) => (
          <span key={tag} className="project-tech-badge">
            {tag}
          </span>
        ))}
      </div>

      <h3 className="project-title">{project.title}</h3>
      <p className="project-description">{project.description}</p>

      <ul className="project-feature-list" aria-label={`${project.title} features`}>
        {project.features.map((feature, i) => (
          <li key={feature} className="project-feature" style={featureStyle(i)}>
            <Check size={15} aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="project-actions">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="project-action project-action-primary"
            aria-label={`View source code for ${project.title}`}
            tabIndex={tabIndex}
          >
            <GitHubIcon />
            Source Code
          </a>
        )}
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="project-action project-action-secondary"
          aria-label={`Open live demo for ${project.title}`}
          tabIndex={tabIndex}
        >
          <ExternalLink size={16} aria-hidden="true" />
          Live Demo
        </a>
      </div>
    </div>
  )
}

interface ProjectMediaProps {
  project: Project
  index: number
  imageFirst: boolean
}

function ProjectMedia({ project, index, imageFirst }: ProjectMediaProps) {
  return (
    <figure className={`project-media project-media-from-${imageFirst ? 'left' : 'right'}`}>
      <div className="project-image-frame">
        <img
          src={project.image || projectFallbackImage}
          alt={project.imageAlt}
          className="project-image"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = projectFallbackImage
          }}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
    </figure>
  )
}

interface ProjectBlockProps {
  project: Project
  index: number
  isInteractive: boolean
}

function ProjectBlock({ project, index, isInteractive }: ProjectBlockProps) {
  const [ref, inView] = useInView<HTMLElement>(0.22)
  const imageFirst = index % 2 === 1

  const info = <ProjectInfo project={project} isInteractive={isInteractive} />
  const media = <ProjectMedia project={project} index={index} imageFirst={imageFirst} />

  return (
    <article
      ref={ref}
      id={`project-${index + 1}`}
      className={`project-showcase project-showcase-${imageFirst ? 'image-first' : 'text-first'}${inView ? ' in-view' : ''}`}
    >
      {imageFirst ? (
        <>
          {media}
          {info}
        </>
      ) : (
        <>
          {info}
          {media}
        </>
      )}
    </article>
  )
}

export default function Projects() {
  const { content } = useContent()
  const projects: Project[] = content.projects
  const [expanded, setExpanded] = useState(false)
  const [renderExtraProjects, setRenderExtraProjects] = useState(false)

  const hasMoreProjects = projects.length > INITIAL_PROJECT_COUNT
  const featuredProjects = projects.slice(0, INITIAL_PROJECT_COUNT)
  const remainingProjects = projects.slice(INITIAL_PROJECT_COUNT)

  function toggleAdditionalProjects() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (expanded) {
      setExpanded(false)

      if (reduceMotion) {
        setRenderExtraProjects(false)
      }

      return
    }

    setRenderExtraProjects(true)

    if (reduceMotion) {
      setExpanded(true)
      return
    }

    requestAnimationFrame(() => setExpanded(true))
  }

  function handleExtraTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !expanded) {
      setRenderExtraProjects(false)
    }
  }

  return (
    <section id="projects" className="section section-alt projects-section">
      <div className="section-inner section-with-side-label">
        <SectionSideLabel label="Projects" />

        <SectionHeading
          title="Featured Work"
          text="A selection of projects I've built over the years."
          centered
        />

        <div className="projects-story-layout">
          <div className="projects-list">
            <div className="projects-featured">
              {featuredProjects.map((project, index) => (
                <ProjectBlock
                  key={project.title}
                  project={project}
                  index={index}
                  isInteractive
                />
              ))}
            </div>

            {hasMoreProjects && (
              <div className="projects-more-wrap">
                <button
                  type="button"
                  className="projects-more-button"
                  aria-expanded={expanded}
                  aria-controls="additional-projects"
                  onClick={toggleAdditionalProjects}
                >
                  {expanded ? 'Show Less' : 'More Projects'}
                  <ArrowDown size={17} aria-hidden="true" />
                </button>
              </div>
            )}

            {hasMoreProjects && renderExtraProjects && (
              <div
                id="additional-projects"
                className={`projects-extra${expanded ? ' expanded' : ''}`}
                aria-hidden={!expanded}
                onTransitionEnd={handleExtraTransitionEnd}
              >
                <div className="projects-extra-inner">
                  {remainingProjects.map((project, i) => {
                    const index = i + INITIAL_PROJECT_COUNT

                    return (
                      <ProjectBlock
                        key={project.title}
                        project={project}
                        index={index}
                        isInteractive={expanded}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
