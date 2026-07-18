import { useInView } from '../hooks/useInView'

interface SectionHeadingProps {
  label?: string
  title: string
  text?: string
  centered?: boolean
}

export default function SectionHeading({ label, title, text, centered }: SectionHeadingProps) {
  const [ref, inView] = useInView()

  return (
    <div
      ref={ref}
      className={`section-heading${centered ? ' section-heading-centered' : ''}${inView ? ' in-view' : ''}`}
    >
      {label && <p className="section-heading-label heading-motion heading-motion-1">{label}</p>}
      <h2 className="section-heading-title heading-motion heading-motion-2">{title}</h2>
      {text && <p className="section-heading-text heading-motion heading-motion-3">{text}</p>}
    </div>
  )
}
