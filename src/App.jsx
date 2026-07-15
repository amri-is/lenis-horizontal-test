// App.jsx
import { useEffect, useRef } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)
  const firstPanelRef = useRef(null)
  const lastPanelRef = useRef(null) // new

  useLenis(ScrollTrigger.update)

  useEffect(() => {
    const track = trackRef.current
    const wrapper = wrapperRef.current
    const firstPanel = firstPanelRef.current
    const lastPanel = lastPanelRef.current

    const ctx = gsap.context(() => {
      const getScrollAmount = () => track.scrollWidth - window.innerWidth

      // first panel padding shrink, before pin starts
      gsap.set(firstPanel, { marginLeft: '30vw' })
      gsap.to(firstPanel, {
        marginLeft: '0vw',
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // last panel start state
      gsap.set(lastPanel, { y: '100%', opacity: 0 })

      // pin timeline: track scroll (full) + last panel reveal (last 20%)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      })

      tl.to(track, { x: () => -getScrollAmount(), ease: 'none', duration: 1 }, 0)
      tl.to(lastPanel, { y: '0%', opacity: 1, ease: 'none', duration: 0.2 }, 0.8)

      return () => tl.scrollTrigger?.kill()
    })

    return () => ctx.revert()
  }, [])

  return (
    <ReactLenis root options={{ autoRaf: false }}>
      <GsapTicker />

      <section className="panel">1</section>
      <section className="panel">2</section>

      <section className="hz-wrapper" ref={wrapperRef}>
        <div className="hz-track" ref={trackRef}>
          <div className="panel" ref={firstPanelRef}>H1</div>
          <div className="panel">H2</div>
          <div className="panel">H3</div>
          <div className="panel">H4</div>
          <div className="panel">H5</div>
          <div className="panel">H6</div>
          <div className="panel">H7</div>
          <div className="panel" ref={lastPanelRef}>H8</div>
        </div>
      </section>

      <section className="panel">3</section>
      <section className="panel">4</section>
    </ReactLenis>
  )
}

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