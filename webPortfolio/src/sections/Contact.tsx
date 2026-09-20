import type { CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import SectionSideLabel from '../components/SectionSideLabel'
import { useContent } from '../data/useContent'

interface ContactMotionStyle extends CSSProperties {
  '--contact-delay': string
}

interface ContactMethod {
  label: string
  value: string
  href?: string
  ariaLabel: string
  icon: LucideIcon
}

interface ContactSectionChildProps {
  inView: boolean
}

function contactMotionStyle(delay: number): ContactMotionStyle {
  return { '--contact-delay': `${delay}ms` }
}

function contactRevealClass(baseClass: string, inView: boolean) {
  return `${baseClass} contact-reveal${inView ? ' in-view' : ''}`
}

function ContactHeader({ inView }: ContactSectionChildProps) {
  return (
    <div className="contact-header" aria-labelledby="contact-heading">
      <h2
        id="contact-heading"
        className={contactRevealClass('contact-header-title', inView)}
        style={contactMotionStyle(0)}
      >
        Get In <span>Touch</span>
      </h2>
      <p
        className={contactRevealClass('contact-header-text', inView)}
        style={contactMotionStyle(120)}
      >
        Have a project in mind or simply want to connect? Let's create something exceptional together.
      </p>
    </div>
  )
}

function ContactMethodItem({ method }: { method: ContactMethod }) {
  const Icon = method.icon

  return (
    <div className="contact-method">
      <span className="contact-method-icon" aria-hidden="true">
        <Icon />
      </span>
      <span className="contact-method-copy">
        <span className="contact-method-label">{method.label}</span>
        {method.href ? (
          <a className="contact-method-value contact-method-link" href={method.href} aria-label={method.ariaLabel}>
            {method.value}
          </a>
        ) : (
          <span className="contact-method-value">{method.value}</span>
        )}
      </span>
    </div>
  )
}

function ContactInfoCard({ inView }: ContactSectionChildProps) {
  const { content } = useContent()
  const contactMethods: ContactMethod[] = [
    {
      label: 'Email',
      value: content.contact.email,
      href: `mailto:${content.contact.email}`,
      ariaLabel: `Email ${content.profile.name} at ${content.contact.email}`,
      icon: Mail,
    },
    {
      label: 'Phone',
      value: content.contact.phone,
      href: `tel:${content.contact.phone.replace(/\s/g, '')}`,
      ariaLabel: `Call ${content.profile.name} at ${content.contact.phone}`,
      icon: Phone,
    },
    {
      label: 'Location',
      value: content.contact.location,
      ariaLabel: `Based in ${content.contact.location}`,
      icon: MapPin,
    },
  ]

  return (
    <div className={contactRevealClass('contact-panel-shell', inView)} style={contactMotionStyle(380)}>
      <aside className="contact-card contact-info-card" aria-label="Contact information">
        <div className="contact-icon-orb" aria-hidden="true">
          <MessageCircle />
        </div>
        <h3 className="contact-info-title">Let's Work Together</h3>
        <p className="contact-info-copy">
          Share the product, portfolio, or brand experience you want to shape. I bring refined
          interface thinking, careful interaction detail, and production-ready frontend craft.
        </p>
        <address className="contact-method-list">
          {contactMethods.map((method) => <ContactMethodItem key={method.label} method={method} />)}
        </address>
        <p className="contact-card-note">
          Let's build something <span>amazing</span> together.
        </p>
      </aside>
    </div>
  )
}

function DirectContactCard({ inView }: ContactSectionChildProps) {
  const { content } = useContent()

  return (
    <div className={contactRevealClass('contact-panel-shell', inView)} style={contactMotionStyle(500)}>
      <div className="contact-card contact-form contact-form-card">
        <div className="contact-icon-orb" aria-hidden="true">
          <Mail />
        </div>
        <h3 className="contact-info-title">Direct Enquiries</h3>
        <p className="contact-info-copy">
          The quickest way to discuss a project or collaboration is by email. I will reply as soon as possible.
        </p>
        <a className="btn-primary contact-submit-button" href={`mailto:${content.contact.email}`}>
          <Mail size={18} aria-hidden="true" />
          <span>Email Me</span>
        </a>
      </div>
    </div>
  )
}

export default function Contact() {
  const [sectionRef, inView] = useInView<HTMLElement>(0.12)

  return (
    <section ref={sectionRef} id="contact" className="section contact-section" aria-labelledby="contact-heading">
      <div className="section-inner section-with-side-label contact-section-inner">
        <SectionSideLabel label="Contact" />
        <ContactHeader inView={inView} />
        <div className="contact-layout">
          <ContactInfoCard inView={inView} />
          <DirectContactCard inView={inView} />
        </div>
      </div>
    </section>
  )
}
