import {
  Code2, Palette, Server, GitBranch, Database, Layout,
  Smartphone, Terminal,
} from 'lucide-react'
import { useInView } from '../hooks/useInView'
import SectionHeading from '../components/SectionHeading'
import { motionClass, motionStyle } from '../utils/motion'

const skills = [
  { name: 'React', icon: Code2 },
  { name: 'TypeScript', icon: Code2 },
  { name: 'JavaScript', icon: Code2 },
  { name: 'HTML/CSS', icon: Layout },
  { name: 'Responsive Design', icon: Smartphone },
  { name: 'UI/UX Design', icon: Palette },
  { name: 'Node.js', icon: Server },
  { name: 'Git', icon: GitBranch },
  { name: 'Databases', icon: Database },
  { name: 'Tailwind CSS', icon: Palette },
  { name: 'GitHub', icon: GitBranch },
  { name: 'CLI', icon: Terminal },
]

export default function Skills() {
  const [ref, inView] = useInView()

  return (
    <section id="skills" className="section">
      <div className="section-inner">
        <SectionHeading
          title="Technologies & Tools"
          text="The tools and technologies I use to bring ideas to life."
          centered
        />

        <div ref={ref} className="skills-grid">
          {skills.map((skill, i) => {
            const Icon = skill.icon
            return (
              <div
                key={skill.name}
                className={motionClass('skill-card', inView, 'from-bottom')}
                style={motionStyle(i, 80)}
              >
                <div className="skill-card-icon">
                  <Icon />
                </div>
                <p className="skill-card-name">{skill.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
