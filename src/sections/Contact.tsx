import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import SectionHeading from '../components/SectionHeading'
import { motionClass, motionStyle } from '../utils/motion'

export default function Contact() {
  const [ref, inView] = useInView()

  return (
    <section id="contact" className="section">
      <div className="section-inner">
        <SectionHeading
          title="Get In Touch"
          text="Have a project in mind or just want to say hello? I'd love to hear from you."
          centered
        />

        <div ref={ref} className="contact-grid">
          <div
            className={motionClass('contact-info contact-card', inView, 'from-left')}
            style={motionStyle(0, 100)}
          >
            <h3>Let's work together</h3>
            <p>
              I'm always open to new opportunities, collaborations, and interesting projects.
              Feel free to reach out — I'll get back to you as soon as possible.
            </p>
            <div className="contact-details">
              <div className="contact-detail">
                <Mail aria-hidden="true" />
                <span>ivarhinisan@email.com</span>
              </div>
              <div className="contact-detail">
                <Phone aria-hidden="true" />
                <span>+63 912 345 6789</span>
              </div>
              <div className="contact-detail">
                <MapPin aria-hidden="true" />
                <span>Philippines</span>
              </div>
            </div>
          </div>

          <form
            className={motionClass('contact-form contact-card', inView, 'from-right')}
            style={motionStyle(1, 100)}
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <input type="text" placeholder="Subject" />
            <textarea placeholder="Your Message" required />
            <button type="submit" className="btn-primary">
              <Send size={16} aria-hidden="true" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
