"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

type IntegrationApp = {
  name: string
  logo: string
}

type IntegrationCarouselProps = {
  title?: string
  subtitle?: string
  buttonText?: string
  topRowApps?: IntegrationApp[]
  bottomRowApps?: IntegrationApp[]
}

const defaultTopRowApps: IntegrationApp[] = [
  { name: "YouTube", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg" },
  { name: "Google Drive", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googledrive.svg" },
  { name: "Notion", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/notion.svg" },
  { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/figma.svg" },
  { name: "Dropbox", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/dropbox.svg" },
  { name: "Vimeo", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/vimeo.svg" },
]

const defaultBottomRowApps: IntegrationApp[] = [
  { name: "Zoom", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/zoom.svg" },
  { name: "Slack", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/slack.svg" },
  { name: "Google Meet", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlemeet.svg" },
  { name: "Discord", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/discord.svg" },
  { name: "Loom", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/loom.svg" },
  { name: "Miro", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/miro.svg" },
]

export const IntegrationCarousel = ({
  title = "Works with the tools trainers already use.",
  subtitle = "Upload videos, PDFs, slides, and course materials from your favorite platforms — everything organized in one learning space.",
  buttonText = "See how it works",
  topRowApps = defaultTopRowApps,
  bottomRowApps = defaultBottomRowApps,
}: IntegrationCarouselProps) => {
  const topRowRef = useRef<HTMLDivElement>(null)
  const bottomRowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let topPosition = 0
    let bottomPosition = 0

    const animateTop = () => {
      if (topRowRef.current) {
        topPosition -= 0.5
        if (Math.abs(topPosition) >= topRowRef.current.scrollWidth / 2) topPosition = 0
        topRowRef.current.style.transform = `translateX(${topPosition}px)`
      }
      requestAnimationFrame(animateTop)
    }

    const animateBottom = () => {
      if (bottomRowRef.current) {
        bottomPosition -= 0.65
        if (Math.abs(bottomPosition) >= bottomRowRef.current.scrollWidth / 2) bottomPosition = 0
        bottomRowRef.current.style.transform = `translateX(${bottomPosition}px)`
      }
      requestAnimationFrame(animateBottom)
    }

    requestAnimationFrame(animateTop)
    requestAnimationFrame(animateBottom)
  }, [])

  return (
    <div className="w-full py-24 bg-background">
      <div className="max-w-[680px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center mb-20"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-foreground text-[40px] font-normal leading-tight tracking-tight">
              {title}
            </h2>

            <p className="text-muted-foreground text-lg leading-7 max-w-[600px]">
              {subtitle}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6"
          >
            <button
              className="
                inline-block px-5 py-2.5 rounded-full 
                bg-background text-foreground 
                text-[15px] font-medium leading-6 
                w-[182px] cursor-pointer
                transition-shadow duration-150
                border border-border
                hover:shadow-md
              "
            >
              {buttonText}
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div className="h-[268px] relative overflow-hidden -mt-6">
        {/* Top row */}
        <div
          ref={topRowRef}
          className="flex items-start gap-6 absolute top-6 whitespace-nowrap will-change-transform"
        >
          {[...topRowApps, ...topRowApps].map((app, i) => (
            <div
              key={`top-${i}`}
              className="flex items-center justify-center w-24 h-24 rounded-3xl flex-shrink-0 
                bg-card shadow-sm border border-border"
            >
              <img src={app.logo} alt={app.name} className="w-9 h-9 object-contain" />
            </div>
          ))}
        </div>

        {/* Fade Right */}
        <div className="absolute right-0 top-0 bottom-0 w-60 pointer-events-none bg-gradient-to-r from-transparent to-background" />

        {/* Fade Left */}
        <div className="absolute left-0 top-0 bottom-0 w-60 pointer-events-none bg-gradient-to-l from-transparent to-background" />

        {/* Bottom row */}
        <div
          ref={bottomRowRef}
          className="flex items-start gap-6 absolute top-[148px] whitespace-nowrap will-change-transform"
        >
          {[...bottomRowApps, ...bottomRowApps].map((app, i) => (
            <div
              key={`bottom-${i}`}
              className="flex items-center justify-center w-24 h-24 rounded-3xl flex-shrink-0 
                bg-card shadow-sm border border-border"
            >
              <img src={app.logo} alt={app.name} className="w-9 h-9 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
