import { useContent } from '../data/useContent'
import { useState, useEffect, useRef } from 'react'
import { Download, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const { content } = useContent()
  const resume = content.profile.meta?.resume
  const visibleNavLinks = navLinks.filter((link) => {
    if (link.href === '#skills') return content.settings?.showSkills !== false
    if (link.href === '#projects') return content.settings?.showProjects !== false
    if (link.href === '#services') return content.settings?.showServices !== false
    if (link.href === '#contact') return content.settings?.showContact !== false
    return true
  })
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const mobileMenuRef = useRef<HTMLElement>(null)
  const mobileToggleRef = useRef<HTMLButtonElement>(null)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY
      const lastScrollY = lastScrollYRef.current

      setScrolled(currentScrollY > 20)

      if (!mobileOpen) {
        if (currentScrollY > lastScrollY + 8 && currentScrollY > 140) {
          setHidden(true)
        } else if (currentScrollY < lastScrollY - 8 || currentScrollY < 80) {
          setHidden(false)
        }
      }

      lastScrollYRef.current = currentScrollY
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mobileOpen])

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section))

    if (sections.length === 0 || !('IntersectionObserver' in window)) return

    const visibleSections = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = (entry.target as HTMLElement).id

          if (entry.isIntersecting) {
            visibleSections.add(sectionId)
          } else {
            visibleSections.delete(sectionId)
          }
        })

        const nextActiveSection = sections
          .map((section) => section.id)
          .reverse()
          .find((sectionId) => visibleSections.has(sectionId))

        if (nextActiveSection) {
          setActiveSection(nextActiveSection)
        }
      },
      {
        rootMargin: '-42% 0px -57% 0px',
        threshold: 0,
      }
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node

      if (
        mobileMenuRef.current?.contains(target) ||
        mobileToggleRef.current?.contains(target)
      ) {
        return
      }

      setMobileOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)
  const toggleMobile = () => {
    if (!mobileOpen) setHidden(false)
    setMobileOpen((open) => !open)
  }

  return (
    <>
      <header className={`navbar${scrolled ? ' scrolled' : ''}${hidden ? ' hidden' : ''}`}>
        <nav className="navbar-inner" aria-label="Primary navigation">
          <a href="#home" className="navbar-logo" onClick={closeMobile}>
            {content.profile.name.split(' ')[0]}<span>.</span>
          </a>

          <div className="navbar-links">
            {visibleNavLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1)

              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`navbar-link${isActive ? ' active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </a>
              )
            })}
          </div>

          <div className="navbar-actions">
            {resume && <a href={resume} className="navbar-cta navbar-desktop-cta" download>
              <Download size={16} aria-hidden="true" />
              Download CV
            </a>}

            <ThemeToggle />

            <button
              ref={mobileToggleRef}
              className="navbar-mobile-toggle"
              onClick={toggleMobile}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`navbar-overlay${mobileOpen ? ' open' : ''}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      <nav
        ref={mobileMenuRef}
        id="mobile-navigation"
        className={`navbar-mobile-menu${mobileOpen ? ' open' : ''}`}
        aria-label="Mobile navigation"
      >
        {visibleNavLinks.map((link) => {
          const isActive = activeSection === link.href.slice(1)

          return (
            <a
              key={link.href}
              href={link.href}
              className={isActive ? 'active' : ''}
              aria-current={isActive ? 'page' : undefined}
              onClick={closeMobile}
            >
              {link.label}
            </a>
          )
        })}
        {resume && <a href={resume} className="navbar-cta mobile-cta" onClick={closeMobile} download>
          <Download size={16} aria-hidden="true" />
          Download CV
        </a>}
      </nav>
    </>
  )
}
