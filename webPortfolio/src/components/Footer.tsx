import { useContent } from '../data/useContent'
import type { CSSProperties } from 'react'
import { Send } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import SocialLinks from './SocialLinks'

interface FooterLink {
  label: string
  href: string
}

interface FooterMotionStyle extends CSSProperties {
  '--footer-delay': string
}

interface FooterColumnHeadingProps {
  id: string
  children: string
}

interface FooterLinkListProps {
  links: FooterLink[]
}

const FOOTER_YEAR = 2026

const navigationLinks: FooterLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]


function footerMotionStyle(index: number): FooterMotionStyle {
  return {
    '--footer-delay': `${index * 130}ms`,
  }
}

function FooterColumnHeading({ id, children }: FooterColumnHeadingProps) {
  return (
    <h3 id={id} className="footer-column-heading">
      {children}
    </h3>
  )
}

function FooterLinkList({ links }: FooterLinkListProps) {
  return (
    <ul className="footer-link-list">
      {links.map((link) => (
        <li key={`${link.label}-${link.href}`}>
          <a className="footer-link" href={link.href}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

function FooterBrand() {
  const { content } = useContent()
  return (
    <section className="footer-column footer-brand footer-reveal" style={footerMotionStyle(0)}>
      <h2 id="footer-heading" className="footer-logo">
        {content.profile.name.split(' ')[0]}<span>.</span>
      </h2>
      <p className="footer-brand-copy">
        I build premium, responsive, user-focused digital experiences combining clean design and
        modern frontend technologies.
      </p>
      <a href="#contact" className="btn-secondary footer-button footer-button-navy">
        <span>Let's Work Together</span>
        <Send size={17} aria-hidden="true" />
      </a>
    </section>
  )
}

function FooterNavigation() {
  return (
    <nav
      className="footer-column footer-navigation footer-reveal"
      style={footerMotionStyle(1)}
      aria-labelledby="footer-navigation-heading"
    >
      <FooterColumnHeading id="footer-navigation-heading">NAVIGATION</FooterColumnHeading>
      <FooterLinkList links={navigationLinks} />
    </nav>
  )
}

function FooterServices() {
  const { content } = useContent()
  const serviceLinks = content.services.map((service) => ({ label: service.title, href: '#services' }))
  return (
    <section
      className="footer-column footer-services footer-reveal"
      style={footerMotionStyle(2)}
      aria-labelledby="footer-services-heading"
    >
      <FooterColumnHeading id="footer-services-heading">SERVICES</FooterColumnHeading>
      <FooterLinkList links={serviceLinks} />
    </section>
  )
}

function FooterCTA() {
  return (
    <section
      className="footer-column footer-cta footer-reveal"
      style={footerMotionStyle(3)}
      aria-labelledby="footer-cta-heading"
    >
      <FooterColumnHeading id="footer-cta-heading">LET'S CONNECT</FooterColumnHeading>
      <p className="footer-cta-copy">
        I'm always open to exciting projects, freelance opportunities, collaborations, and creative
        ideas.
      </p>
      <a href="#contact" className="btn-primary footer-button footer-button-royal">
        <span>Start a Project</span>
        <Send size={18} aria-hidden="true" />
      </a>
    </section>
  )
}

function FooterSocialIcons() {
  return (
    <nav className="footer-social-nav" aria-label="Social links">
      <SocialLinks className="footer-social" />
    </nav>
  )
}

function FooterBottom() {
  const { content } = useContent()
  return (
    <div className="footer-bottom footer-reveal" style={footerMotionStyle(4)}>
      <div className="footer-bottom-copy">
        <p>&copy; {FOOTER_YEAR} {content.profile.name}</p>
        <p>All rights reserved.</p>
        <p className="footer-built-with">
          Designed &amp; Built with <span role="img" aria-label="love">❤️</span> using React + TypeScript
        </p>
      </div>

      <FooterSocialIcons />

      <address className="footer-location">
        <span>{content.profile.location}</span>
        <span className="footer-availability">
          <span className="footer-status-dot" aria-hidden="true" />
          Available for Freelance
        </span>
      </address>
    </div>
  )
}

export default function Footer() {
  const [footerRef, inView] = useInView<HTMLElement>(0.08)

  return (
    <footer
      ref={footerRef}
      className={`footer${inView ? ' in-view' : ''}`}
      aria-labelledby="footer-heading"
    >
      <div className="footer-inner">
        <div className="footer-main">
          <FooterBrand />
          <FooterNavigation />
          <FooterServices />
          <FooterCTA />
        </div>

        <FooterBottom />
      </div>
    </footer>
  )
}
