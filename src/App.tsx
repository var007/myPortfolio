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
      <Footer />
      <ChatBot />
    </>
  )
}

export default App
