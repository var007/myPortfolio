import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties, FormEvent } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import SectionSideLabel from '../components/SectionSideLabel'

type ContactStatus = 'idle' | 'loading' | 'success'
type ContactFieldName = 'firstName' | 'email' | 'subject' | 'message'

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

interface ContactFormValues {
  firstName: string
  email: string
  subject: string
  message: string
}

interface ContactSectionChildProps {
  inView: boolean
}

interface InputFieldProps extends ContactSectionChildProps {
  id: string
  name: ContactFieldName
  label: string
  placeholder: string
  value: string
  delay: number
  onValueChange: (name: ContactFieldName, value: string) => void
  autoComplete?: string
  type?: 'text' | 'email'
  required?: boolean
  multiline?: boolean
}

const initialFormValues: ContactFormValues = {
  firstName: '',
  email: '',
  subject: '',
  message: '',
}

const contactMethods: ContactMethod[] = [
  {
    label: 'Email',
    value: 'ivarhinisan@email.com',
    href: 'mailto:ivarhinisan@email.com',
    ariaLabel: 'Email Ivar Hinisan at ivarhinisan@email.com',
    icon: Mail,
  },
  {
    label: 'Phone',
    value: '+63 912 345 6789',
    href: 'tel:+639123456789',
    ariaLabel: 'Call Ivar Hinisan at +63 912 345 6789',
    icon: Phone,
  },
  {
    label: 'Location',
    value: 'Philippines',
    ariaLabel: 'Based in the Philippines',
    icon: MapPin,
  },
]

function contactMotionStyle(delay: number): ContactMotionStyle {
  return {
    '--contact-delay': `${delay}ms`,
  }
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
          <a
            className="contact-method-value contact-method-link"
            href={method.href}
            aria-label={method.ariaLabel}
          >
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
          {contactMethods.map((method) => (
            <ContactMethodItem key={method.label} method={method} />
          ))}
        </address>

        <p className="contact-card-note">
          Let's build something <span>amazing</span> together.
        </p>
      </aside>
    </div>
  )
}

function InputField({
  id,
  name,
  label,
  placeholder,
  value,
  delay,
  inView,
  onValueChange,
  autoComplete,
  type = 'text',
  required,
  multiline,
}: InputFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    onValueChange(name, event.currentTarget.value)
  }

  return (
    <div
      className={contactRevealClass('contact-field-shell', inView)}
      style={contactMotionStyle(delay)}
    >
      <label className="contact-field-label" htmlFor={id}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          className="contact-field-control contact-message-control"
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={handleChange}
        />
      ) : (
        <input
          id={id}
          name={name}
          className="contact-field-control"
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={handleChange}
        />
      )}
    </div>
  )
}

function SubmitButton({ inView, isLoading }: ContactSectionChildProps & { isLoading: boolean }) {
  return (
    <div
      className={contactRevealClass('contact-submit-shell', inView)}
      style={contactMotionStyle(1080)}
    >
      <button
        type="submit"
        className="btn-primary contact-submit-button"
        disabled={isLoading}
        aria-label={isLoading ? 'Sending message' : 'Send message'}
      >
        {isLoading ? (
          <span className="contact-loading-spinner" aria-hidden="true" />
        ) : (
          <Send size={18} aria-hidden="true" />
        )}
        <span>{isLoading ? 'Sending...' : 'Send Message'}</span>
      </button>
    </div>
  )
}

function ContactForm({ inView }: ContactSectionChildProps) {
  const [formValues, setFormValues] = useState<ContactFormValues>(initialFormValues)
  const [status, setStatus] = useState<ContactStatus>('idle')
  const submitTimeoutRef = useRef<number | undefined>(undefined)
  const isLoading = status === 'loading'
  const isSuccess = status === 'success'

  useEffect(() => {
    return () => window.clearTimeout(submitTimeoutRef.current)
  }, [])

  function handleValueChange(name: ContactFieldName, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))

    if (isSuccess) {
      setStatus('idle')
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isLoading) return

    window.clearTimeout(submitTimeoutRef.current)
    setStatus('loading')

    submitTimeoutRef.current = window.setTimeout(() => {
      setStatus('success')
      setFormValues(initialFormValues)
    }, 900)
  }

  return (
    <div className={contactRevealClass('contact-panel-shell', inView)} style={contactMotionStyle(500)}>
      <form
        className="contact-card contact-form contact-form-card"
        onSubmit={handleSubmit}
        aria-labelledby="contact-form-heading"
        aria-describedby="contact-form-feedback"
        aria-busy={isLoading}
      >
        <h3 id="contact-form-heading" className="sr-only">
          Send a message
        </h3>

        <div className="contact-form-row contact-form-row-split">
          <InputField
            id="contact-first-name"
            name="firstName"
            label="First Name"
            placeholder="First Name"
            autoComplete="given-name"
            required
            value={formValues.firstName}
            delay={660}
            inView={inView}
            onValueChange={handleValueChange}
          />
          <InputField
            id="contact-email"
            name="email"
            label="Email"
            placeholder="Email"
            autoComplete="email"
            type="email"
            required
            value={formValues.email}
            delay={760}
            inView={inView}
            onValueChange={handleValueChange}
          />
        </div>

        <InputField
          id="contact-subject"
          name="subject"
          label="Subject"
          placeholder="Subject"
          autoComplete="off"
          value={formValues.subject}
          delay={860}
          inView={inView}
          onValueChange={handleValueChange}
        />

        <InputField
          id="contact-message"
          name="message"
          label="Message"
          placeholder="Message"
          required
          multiline
          value={formValues.message}
          delay={960}
          inView={inView}
          onValueChange={handleValueChange}
        />

        <SubmitButton inView={inView} isLoading={isLoading} />

        <div
          id="contact-form-feedback"
          className={`contact-form-feedback${isSuccess ? ' is-visible' : ''}`}
          role="status"
          aria-live="polite"
        >
          {isSuccess && (
            <>
              <span className="contact-success-mark" aria-hidden="true" />
              <span className="contact-feedback-copy">
                <strong>Message sent successfully.</strong>
                <span>I'll get back to you as soon as possible.</span>
              </span>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

export default function Contact() {
  const [sectionRef, inView] = useInView<HTMLElement>(0.12)

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section contact-section"
      aria-labelledby="contact-heading"
    >
      <div className="section-inner section-with-side-label contact-section-inner">
        <SectionSideLabel label="Contact" />

        <ContactHeader inView={inView} />

        <div className="contact-layout">
          <ContactInfoCard inView={inView} />
          <ContactForm inView={inView} />
        </div>
      </div>
    </section>
  )
}
