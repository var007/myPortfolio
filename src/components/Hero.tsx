import { ArrowRight, Download } from 'lucide-react'
import myPhoto from '../assets/my-photo-removebg.png'
import SocialLinks from './SocialLinks'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-bg-glow hero-bg-glow-1" />
      <div className="hero-bg-glow hero-bg-glow-2" />
      <div className="hero-bg-dots" />

      <div className="hero-container">
        <div className="hero-text-col">
          <p className="hero-greeting">HELLO, I'M</p>
          <h1 className="hero-name">
            Ivar <span>Hinisan</span>
          </h1>
          <p className="hero-title">IT Student &amp; Frontend Developer</p>
          <p className="hero-description">
            I design and build responsive, modern, and user-friendly web and mobile experiences.
            I focus on creating polished interfaces, intuitive user experiences, and reliable
            frontend applications using modern technologies.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn-primary">
              View My Projects
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="/Ivar-Hinisan-CV.pdf" className="btn-secondary" download>
              <Download size={18} aria-hidden="true" />
              Download CV
            </a>
          </div>
          <div className="hero-social-wrap">
            <span>Connect with me</span>
            <SocialLinks className="hero-social" />
          </div>
        </div>

        <div className="hero-image-col">
          <div className="hero-image-container">
            <div className="hero-orbit hero-orbit-1" />
            <div className="hero-orbit hero-orbit-2" />
            <div className="hero-orbit hero-orbit-3" />
            <div className="hero-image-glow" />
            <div className="hero-portrait-frame">
              <img
                src={myPhoto}
                alt="Portrait of Ivar Hinisan"
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
