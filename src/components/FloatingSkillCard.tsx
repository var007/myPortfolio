import type { ReactNode } from 'react'

interface FloatingSkillCardProps {
  icon: ReactNode
  label: string
  style?: React.CSSProperties
}

export default function FloatingSkillCard({ icon, label, style }: FloatingSkillCardProps) {
  return (
    <div className="floating-skill-card" style={style}>
      {icon}
      <span>{label}</span>
    </div>
  )
}
