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
    headline = "Corporate training built for real results",
    subheadline = "Enroll teams into structured courses and track progress in real time.",
    description = "Give managers full visibility into completion, quiz scores, and performance across the entire company. Deliver consistent training without manual tracking, external marketplaces, or individual payments.",
    videoSrc = "/videos/corporate-dashboard-showcase.mp4",
    posterSrc = "/students-working-together-project.jpg",
    primaryButtonText = "Book demo",
    primaryButtonHref = "/waitlist",
    secondaryButtonText = "Explore courses",
    secondaryButtonHref = "/courses",
  } = props

  return (
    <section className="w-full bg-background py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT CARD */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="
              col-span-12 lg:col-span-6
              rounded-3xl
              p-10 lg:p-14
              flex flex-col justify-end
              aspect-square
              overflow-hidden
              bg-muted/40
            "
          >

            {/* HEADLINE */}
            <h1
              className="
                text-3xl md:text-4xl lg:text-5xl
                font-semibold
                tracking-tight
                leading-tight
                text-foreground
                max-w-xl
                mb-5
              "
            >
              {headline}
            </h1>

            {/* SUBHEADLINE */}
            <p className="text-lg text-muted-foreground max-w-xl mb-4">
              {subheadline}
            </p>

            {/* DESCRIPTION */}
            <p className="text-sm md:text-base text-muted-foreground/90 max-w-xl mb-8 leading-relaxed">
              {description}
            </p>

            {/* BUTTONS */}
            <div className="flex gap-3 flex-wrap mt-4">

              <a
                href={primaryButtonHref}
                onClick={(e) => e.preventDefault()}
                className="
                  inline-flex items-center gap-2
                  h-10 px-5
                  rounded-lg
                  bg-primary text-primary-foreground
                  text-sm font-medium
                  transition hover:opacity-90
                "
              >
                {primaryButtonText}
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={secondaryButtonHref}
                onClick={(e) => e.preventDefault()}
                className="
                  inline-flex items-center
                  h-10 px-5
                  rounded-lg
                  border border-border
                  text-sm font-medium
                  text-foreground
                  hover:bg-muted
                  transition
                "
              >
                {secondaryButtonText}
              </a>

            </div>

          </motion.div>


          {/* RIGHT CARD */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="
              col-span-12 lg:col-span-6
              rounded-3xl
              aspect-square
              overflow-hidden
              bg-card
              shadow-sm
              flex items-center justify-center
            "
            style={{
              backgroundImage: `url(${posterSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >

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