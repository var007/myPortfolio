import { Code2, Briefcase, Smile, Award } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { motionClass, motionStyle, statMotionDirections } from '../utils/motion'
import myPhoto from '../assets/my-photo.png'

const stats = [
  { number: '1+', label: 'Years Experience', icon: Briefcase },
  { number: '10+', label: 'Projects Completed', icon: Code2 },
  { number: '5+', label: 'Technologies', icon: Award },
  { number: '3+', label: 'Happy Clients', icon: Smile },
]

export default function About() {
  const [imgRef, imgInView] = useInView(0.2)
  const [contentRef, contentInView] = useInView(0.2)
  const [statsRef, statsInView] = useInView(0.2)

  return (
    <section id="about" className="section section-alt">
      <div className="section-inner">
        <div className="about-grid">
          <div
            ref={imgRef}
            className={`about-image-col reveal${imgInView ? ' in-view' : ''}`}
          >
            <div className="about-image-frame">
              <div className="about-image-glow" />
              <div className="about-image-orbit" />
              <img
                src={myPhoto}
                alt="Portrait of Ivar Hinisan"
                className="about-image"
              />
            </div>
          </div>
          <div
            ref={contentRef}
            className={`about-text-col reveal${contentInView ? ' in-view' : ''}`}
          >
            <p className="section-label">WHO I AM</p>
            <h2 className="about-heading">
              Crafting Digital Experiences That Make an Impact
            </h2>
            <div className="about-text">
              <p>
                I'm an IT student and frontend developer who is passionate about building
                clean, modern, and user-friendly interfaces. I enjoy turning ideas into
                real-world solutions through code and design.
              </p>
              <p>
                I continuously explore new technologies and improve my skills to deliver
                experiences that are not only functional but also polished and enjoyable to use.
              </p>
            </div>
            <div ref={statsRef} className="stats-grid">
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className={motionClass('stat-card', statsInView, statMotionDirections[i])}
                    style={motionStyle(i, 100)}
                  >
                    <div className="stat-card-icon">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <p className="stat-card-number">{stat.number}</p>
                    <p className="stat-card-label">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
