# Lenis Horizontal Test

React + Vite prototype recreating a Lando Norris-style landing page.
Project shows a long vertical page that contains a pinned horizontal section with scroll-driven movement.

## What it does

- Simple React app built with `vite`
- Smooth scrolling via `lenis`
- Horizontal section animated with `gsap` + `ScrollTrigger`
- Vertical page flow contains a pinned `hz-wrapper` section that scrolls a wide track horizontally
- Last horizontal panel reveals while the section remains pinned
- Custom scroll indicator synced to lenis scroll progress

## Key files

- `src/App.jsx` — main app logic, `ReactLenis`, `useLenis`, GSAP pin/scroll timeline, horizontal track
- `src/App.css` — layout and visual styles for panels, horizontal wrapper, scroll indicator
- `src/main.jsx` — app entry, renders `App`
- `package.json` — dependencies: `react`, `vite`, `gsap`, `lenis`

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and scroll. The page has vertical panels before and after a pinned horizontal section.

## Build

```bash
npm run build
npm run preview
```
