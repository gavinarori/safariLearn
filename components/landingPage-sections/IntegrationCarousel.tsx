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
  { name: "Workday", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/workday.svg" },
  { name: "BambooHR", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bamboohr.svg" },
  { name: "ADP", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/adp.svg" },
  { name: "Okta", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/okta.svg" },
  { name: "Microsoft Teams", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoftteams.svg" },
  { name: "Slack", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/slack.svg" },
]

const defaultBottomRowApps: IntegrationApp[] = [
  { name: "Salesforce", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/salesforce.svg" },
  { name: "Google Workspace", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googleworkspace.svg" },
  { name: "Zoom", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/zoom.svg" },
  { name: "Power BI", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/powerbi.svg" },
  { name: "SAP SuccessFactors", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/sap.svg" }, // Approximate icon
  { name: "OneLogin", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/onelogin.svg" },
]

export const IntegrationCarousel = ({
  title = "Seamless with your enterprise stack",
  subtitle = "Integrate effortlessly with HRIS, SSO, productivity tools, and analytics platforms. Auto-sync employee data, enable secure company logins, track training ROI in your existing dashboards — all without disruption.",
  buttonText = "View All Integrations",
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
              <img src={app.logo} alt={`${app.name} logo`} className="w-9 h-9 object-contain" />
            </div>
          ))}
        </div>

        {/* Fade gradients */}
        <div className="absolute right-0 top-0 bottom-0 w-60 pointer-events-none bg-gradient-to-r from-transparent to-background" />
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
              <img src={app.logo} alt={`${app.name} logo`} className="w-9 h-9 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}