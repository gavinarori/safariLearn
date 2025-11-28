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
    dailyVolume = "5,200+",
    dailyVolumeLabel = "DAILY ACTIVE LEARNERS",
    headline = "A Modern Learning Management System for Teams and Institutions",
    subheadline = "Deliver structured learning, manage classes, track progress, and engage students with built-in forums, discussions, quizzes, and organized course content — all in one platform.",
    description = "Designed for trainers, educators, and organizations, our LMS simplifies course creation, student management, assessments, and learner engagement.",
    videoSrc = "/videos/lms-showcase.mp4",
    posterSrc = "/study-group-african-people.jpg",
    primaryButtonText = "Explore Courses",
    primaryButtonHref = "/courses",
    secondaryButtonText = "For Trainers",
    secondaryButtonHref = "/trainers",
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
            <a
              href={primaryButtonHref}
              onClick={(e) => e.preventDefault()}
              className="flex flex-col gap-1 text-muted-foreground"
            >
              <motion.span
                initial={{ transform: "translateY(20px)", opacity: 0 }}
                animate={{ transform: "translateY(0px)", opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.645, 0.045, 0.355, 1], delay: 0.6 }}
                className="text-sm uppercase tracking-tight font-mono flex items-center gap-1"
              >
                {dailyVolumeLabel}
                <ArrowUpRight className="w-[0.71em] h-[0.71em]" />
              </motion.span>
            </a>

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
            {/* Hide video for now (you chose display none) */}
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
