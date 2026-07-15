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
  const lastPanelRef = useRef(null)
  const scrollTrackRef = useRef(null)
  const scrollThumbRef = useRef(null)

  const lenis = useLenis(ScrollTrigger.update)

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
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      // last panel start state
      gsap.set(lastPanel, { y: '100%', opacity: 0, width: `100vw` })

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

  // scroll indicator — sync + drag
  useEffect(() => {
    if (!lenis) return
    const wrap = scrollTrackRef.current
    const bar = scrollThumbRef.current
    if (!wrap || !bar) return

    const maxTop = () => wrap.clientHeight - bar.clientHeight

    const onScroll = ({ progress }) => {
      bar.style.top = `${progress * maxTop()}px`
    }
    lenis.on('scroll', onScroll)

    let dragging = false
    let startY = 0
    let startTop = 0

    const onPointerDown = (e) => {
      dragging = true
      startY = e.clientY ?? e.touches?.[0]?.clientY
      startTop = parseFloat(getComputedStyle(bar).top) || 0
    }

    const onPointerMove = (e) => {
      if (!dragging) return
      const y = e.clientY ?? e.touches?.[0]?.clientY
      const newTop = Math.min(Math.max(startTop + (y - startY), 0), maxTop())
      lenis.scrollTo((newTop / maxTop()) * lenis.limit, { immediate: true })
    }

    const onPointerUp = () => { dragging = false }

    bar.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      lenis.off('scroll', onScroll)
      bar.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [lenis])

  return (
    <ReactLenis root options={{ autoRaf: false }}>
      <GsapTicker />

      <div className="scroll-indicator" ref={scrollTrackRef}>
        <div className="scroll-indicator-bar" ref={scrollThumbRef}></div>
      </div>

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