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

const introRef = useRef(null)

useEffect(() => {
  const track = trackRef.current
  const intro = introRef.current
  const wrapper = wrapperRef.current
  const lastPanel = lastPanelRef.current

  const ctx = gsap.context(() => {
    const getScrollAmount = () => track.scrollWidth - window.innerWidth

    gsap.set(intro, { x: '80vw' })
    gsap.to(intro, {
      x: '0vw',
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })

    gsap.set(lastPanel, { y: '100%', opacity: 0 })

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
    tl.to(lastPanel, { y: '0%', opacity: 1, ease: 'none', duration: 0.4 }, 0.6)

    return () => tl.scrollTrigger?.kill()
  })

  return () => ctx.revert()
}, [])

  // scroll indicator — sync + fade
  useEffect(() => {
    if (!lenis) return
    const wrap = scrollTrackRef.current
    const bar = scrollThumbRef.current
    if (!wrap || !bar) return

    const maxTop = () => wrap.clientHeight - bar.clientHeight

    let hideTimeout

    const onScroll = ({ progress }) => {
      bar.style.transform = `translateY(${progress * maxTop()}px)`

      wrap.style.opacity = '1'
      wrap.style.visibility = 'inherit'

      clearTimeout(hideTimeout)
      hideTimeout = setTimeout(() => {
        wrap.style.opacity = '0'
        wrap.style.visibility = 'hidden'
      }, 1000)
    }

    lenis.on('scroll', onScroll)

    return () => {
      lenis.off('scroll', onScroll)
      clearTimeout(hideTimeout)
    }
  }, [lenis])

  return (
    <ReactLenis root options={{ autoRaf: false }}>
      <GsapTicker />

      <div className="scroll-indicator" ref={scrollTrackRef}>
        <div className="scroll-indicator-bar" ref={scrollThumbRef}></div>
      </div>

      <section className="panel font2">1</section>
      <section className="panel">2</section>

      <section className="hz-wrapper" style={{ backgroundColor: '#e7de57' }} ref={wrapperRef}>
        <div className="hz-intro" ref={introRef}>
          <div className="hz-track" style={{ backgroundColor: '#c243a2' }} ref={trackRef}>
            <div className="panel-space-big"></div>
            <div className="panel">H1</div>
            <div className="panel-space"></div>
            <div className="panel">H2</div>
            <div className="panel-space"></div>
            <div className="panel">H3</div>
            <div className="panel-space"></div>
            <div className="panel" ref={lastPanelRef}>H4</div>
          </div>
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