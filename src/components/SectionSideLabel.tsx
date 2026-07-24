interface SectionSideLabelProps {
  label: string
}

export default function SectionSideLabel({ label }: SectionSideLabelProps) {
  return (
    <div className="section-side-label" aria-hidden="true">
      <span className="section-side-label-text">{label}</span>
      <span className="section-side-label-line">
        <span />
      </span>
    </div>
  )
}
