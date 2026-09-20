import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Services from './sections/Services'
import Contact from './sections/Contact'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import { useScrollParallax } from './hooks/useScrollParallax'
import './styles/portfolio.css'
import { useContent } from './data/useContent'

function App() {
  useScrollParallax()
  const { content } = useContent()
  const settings = content.settings

  useEffect(() => {
    if (settings?.siteTitle) document.title = settings.siteTitle
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description && settings?.siteDescription) description.content = settings.siteDescription
  }, [settings?.siteDescription, settings?.siteTitle])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        {settings?.showSkills !== false && <Skills />}
        {settings?.showProjects !== false && <Projects />}
        {settings?.showServices !== false && <Services />}
        {settings?.showContact !== false && <Contact />}
      </main>
      <Footer />
      <ChatBot />
    </>
  )
}

export default App
