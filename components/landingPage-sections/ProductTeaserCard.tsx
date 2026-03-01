"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

type ProductTeaserCardProps = {
  dailyVolume?: string
  dailyVolumeLabel?: string
  headline?: string
  subheadline?: string
  description?: string
  videoSrc?: string
  posterSrc?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
}

export const ProductTeaserCard = (props: ProductTeaserCardProps) => {
  const {
    dailyVolume = "12,000+",
    dailyVolumeLabel = "EMPLOYEE PROGRESS POINTS TRACKED DAILY",
    headline = "Enterprise Training Platform for Measurable Workforce Development",
    subheadline = "Companies enroll teams in structured, reading-first courses with quizzes. Managers get real-time dashboards to track completion, scores, and performance impact — all company-controlled and paid.",
    description = "Deliver consistent, high-quality training across your organization. Reduce admin time, close skills gaps faster, and prove ROI with built-in assessments and manager visibility. No marketplaces, no individual sign-ups — just scalable corporate learning.",
    videoSrc = "/videos/corporate-dashboard-showcase.mp4",
    posterSrc = "/african-american-business-people-analyzing-company-charts-diagrams-laptop-create-startup-presentation-paperwork-report-doing-teamwork-collaboration-plan-research-information.jpg", // Suggest: blurred screenshot of team progress/quiz results
    primaryButtonText = "Book a Demo",
    primaryButtonHref = "/demo",
    secondaryButtonText = "View Manager Features",
    secondaryButtonHref = "/managers",
  } = props

  return (
    <section className="w-full px-8 pt-32 pb-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-2">
          
          {/* LEFT CARD */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1] }}
            className="
              col-span-12 lg:col-span-6 
              rounded-[40px] p-12 lg:p-16 
              flex flex-col justify-end 
              aspect-square overflow-hidden 
              bg-muted dark:bg-muted/30
            "
          >
           

            {/* HEADLINE */}
            <h1
              className="
                text-[40px] md:text-[56px] 
                leading-tight tracking-tight 
                text-foreground 
                max-w-[520px] mb-6
                font-semibold
              
              "
            >
              {headline}
            </h1>

            {/* SUBHEADLINE */}
            <p className="text-lg leading-7 text-muted-foreground max-w-[520px] mb-6">
              {subheadline}
            </p>

            {/* DESCRIPTION */}
            <p className="text-base leading-6 text-muted-foreground/90 max-w-[520px] mb-10 opacity-90">
              {description}
            </p>

            {/* BUTTONS */}
            <ul className="flex gap-1.5 flex-wrap mt-10">
              <li>
                <a
                  href={primaryButtonHref}
                  onClick={(e) => e.preventDefault()}
                  className="
                    block cursor-pointer 
                    text-primary-foreground bg-primary 
                    rounded-full px-[18px] py-[15px] 
                    text-base leading-4 whitespace-nowrap 
                    transition-all duration-150 hover:rounded-2xl
                  "
                >
                  {primaryButtonText}
                </a>
              </li>

              <li>
                <a
                  href={secondaryButtonHref}
                  onClick={(e) => e.preventDefault()}
                  className="
                    block cursor-pointer 
                    border border-foreground/30 
                    text-foreground
                    dark:border-foreground/40
                    rounded-full px-[18px] py-[15px] 
                    text-base leading-4 whitespace-nowrap 
                    transition-all duration-150 hover:rounded-2xl
                  "
                >
                  {secondaryButtonText}
                </a>
              </li>
            </ul>
          </motion.div>

          {/* RIGHT IMAGE / VIDEO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1], delay: 0.2 }}
            className="
              col-span-12 lg:col-span-6 
              rounded-[40px] 
              flex justify-center items-center 
              aspect-square overflow-hidden 
              bg-card dark:bg-card/50
              shadow-sm
            "
            style={{
              backgroundImage: `url(${posterSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Video hidden per your original; uncomment when ready */}
            <video
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              poster={posterSrc}
              className="hidden w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}