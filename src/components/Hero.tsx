import { ArrowRight, Download } from 'lucide-react'
import myPhoto from '../assets/my-photo.png'
import SocialLinks from './SocialLinks'

function HeroButtons() {
  return (
    <div className="hero-actions">
      <a href="#projects" className="btn-primary hero-button hero-button-primary">
        View My Projects
        <ArrowRight size={18} aria-hidden="true" />
      </a>
      <a href="/Ivar-Hinisan-CV.pdf" className="btn-secondary hero-button hero-button-secondary" download>
        <Download size={18} aria-hidden="true" />
        Download CV
      </a>
    </div>
  )
}

function HeroContent() {
  return (
    <div className="hero-text-col">
      <p className="hero-greeting">HELLO, I'M</p>
      <h1 id="hero-heading" className="hero-name">
        <span className="hero-name-line">Ivar</span>
        <span className="hero-name-line hero-name-accent">Hinisan</span>
      </h1>
      <p className="hero-title">IT Student &amp; Frontend Developer</p>
      <p className="hero-description">
        I design and build polished, responsive digital experiences with modern frontend
        technologies, thoughtful interactions, and a strong eye for clean visual systems.
      </p>
      <HeroButtons />
      <div className="hero-social-wrap">
        <span>CONNECT WITH ME</span>
        <SocialLinks className="hero-social" />
      </div>
    </div>
  )
}

function HeroImage() {
  return (
    <figure className="hero-image-col">
      <div className="hero-image-container">
        <span className="hero-image-panel hero-image-panel-back" aria-hidden="true" />
        <span className="hero-image-panel hero-image-panel-offset" aria-hidden="true" />
        <span className="hero-image-radial" aria-hidden="true" />
        <span className="hero-image-circle" aria-hidden="true" />
        <span className="hero-image-dots" aria-hidden="true" />
        <span className="hero-anchor hero-anchor-1" aria-hidden="true" />
        <span className="hero-anchor hero-anchor-2" aria-hidden="true" />

        <div className="hero-portrait-frame">
          <img
            src={myPhoto}
            alt="Portrait of Ivar Hinisan"
            className="hero-image"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </figure>
  )
}

export default function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-heading">
      <div className="hero-bg-glow hero-bg-glow-1" />
      <div className="hero-bg-glow hero-bg-glow-2" />
      <div className="hero-bg-dots" />

      <div className="hero-container">
        <HeroContent />
        <HeroImage />
      </div>
    </section>
  )
}
