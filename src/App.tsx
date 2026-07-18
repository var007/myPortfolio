import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Services from './sections/Services'
import Contact from './sections/Contact'
import SocialLinks from './components/SocialLinks'
import { useScrollParallax } from './hooks/useScrollParallax'
import './styles/portfolio.css'

function App() {
  useScrollParallax()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services />
        <Contact />
      </main>
      <footer className="footer">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Ivar Hinisan. All rights reserved.
        </p>
        <SocialLinks className="hero-social" />
      </footer>
    </>
  )
}

export default App
