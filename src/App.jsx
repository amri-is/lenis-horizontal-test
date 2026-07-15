// App.jsx
import { useEffect, useRef } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)

  // keep ScrollTrigger in sync with lenis's smoothed scroll position
  useLenis(ScrollTrigger.update)

  useEffect(() => {
    const track = trackRef.current
    const wrapper = wrapperRef.current

    const ctx = gsap.context(() => {
      const getScrollAmount = () => track.scrollWidth - window.innerWidth

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          // no snap — continuous strip, not discrete pages
        },
      })

      return () => tween.scrollTrigger?.kill()
    })

    return () => ctx.revert()
  }, [])

  return (
    <ReactLenis root options={{ autoRaf: false }}>
      <GsapTicker />

      <section className="panel">1</section>
      <section className="panel">2</section>

      <section className="horizontal-wrapper" ref={wrapperRef}>
        <div className="horizontal-track" ref={trackRef}>
          <div className="panel">H1</div>
          <div className="panel">H2</div>
          <div className="panel">H3</div>
          <div className="panel">H4</div>
          <div className="panel">H5</div>
          <div className="panel">H6</div>
          <div className="panel">H7</div>
          <div className="panel horizontal-last-panel">H7</div>
        </div>
      </section>

      <section className="panel">3</section>
      <section className="panel">4</section>
    </ReactLenis>
  )
}

// drives lenis's raf off gsap's ticker -> single raf loop, no fighting
function GsapTicker() {
  const lenis = useLenis()
  useEffect(() => {
    if (!lenis) return
    const update = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(update)
  }, [lenis])
  return null
}