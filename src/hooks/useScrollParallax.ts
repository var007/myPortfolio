import { useEffect } from 'react'

export function useScrollParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0

    const updateParallax = () => {
      frame = 0
      const offset = Math.min(window.scrollY * 0.025, 20)
      document.documentElement.style.setProperty('--scroll-parallax', `${offset}px`)
      document.documentElement.style.setProperty('--scroll-parallax-reverse', `${offset * -0.45}px`)
      document.documentElement.style.setProperty('--hero-mobile-parallax', `${offset * -1.25}px`)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(updateParallax)
    }

    updateParallax()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.style.removeProperty('--scroll-parallax')
      document.documentElement.style.removeProperty('--scroll-parallax-reverse')
      document.documentElement.style.removeProperty('--hero-mobile-parallax')
    }
  }, [])
}
