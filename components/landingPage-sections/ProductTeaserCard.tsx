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

// @component: ProductTeaserCard
export const ProductTeaserCard = (props: ProductTeaserCardProps) => {
  const {
    dailyVolume="5,200+",
dailyVolumeLabel="DAILY ACTIVE LEARNERS",
headline="A Modern Learning Management System for Teams and Institutions",
subheadline="Deliver structured learning, manage classes, track progress, and engage students with built-in forums, discussions, quizzes, and organized course content — all in one platform.",
description="Designed for trainers, educators, and organizations, our LMS simplifies course creation, student management, assessments, and learner engagement. With real-time progress tracking, integrated discussion boards, and accessible learning tools, it’s everything you need to support effective teaching and learning.",
videoSrc="/videos/lms-showcase.mp4",
posterSrc="/study-group-african-people.jpg",
primaryButtonText="Explore Courses",
primaryButtonHref="/courses",
secondaryButtonText="For Trainers",
secondaryButtonHref="/trainers"

  } = props

  // @return
  return (
    <section className="w-full px-8 pt-32 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-2">
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              ease: [0.645, 0.045, 0.355, 1],
            }}
            className="col-span-12 lg:col-span-6 bg-[#e9e9e9] rounded-[40px] p-12 lg:p-16 flex flex-col justify-end aspect-square overflow-hidden"
          >
            <a
              href={primaryButtonHref}
              onClick={(e) => e.preventDefault()}
              className="flex flex-col gap-1 text-[#9a9a9a]"
            >
              <motion.span
                initial={{
                  transform: "translateY(20px)",
                  opacity: 0,
                }}
                animate={{
                  transform: "translateY(0px)",
                  opacity: 1,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.645, 0.045, 0.355, 1],
                  delay: 0.6,
                }}
                className="text-sm uppercase tracking-tight font-mono flex items-center gap-1"
                style={{
                  fontFamily: "var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace",
                }}
              >
                {dailyVolumeLabel}
                <ArrowUpRight className="w-[0.71em] h-[0.71em]" />
              </motion.span>
              <span
                className="text-[32px] leading-[160px] tracking-tight bg-gradient-to-r from-[#202020] via-[#00517f] via-[#52aee3] to-[#9ed2fc] bg-clip-text text-transparent"
                style={{
                  fontFeatureSettings: '"clig" 0, "liga" 0',
                  height: "98px",
                  marginBottom: "0px",
                  paddingTop: "",
                  display: "none",
                }}
              >
                {dailyVolume}
              </span>
            </a>

            <h1
              className="text-[56px] leading-[60px] tracking-tight text-[#202020] max-w-[520px] mb-6"
              style={{
                fontWeight: "500",
                fontFamily: "var(--font-figtree), Figtree",
              }}
            >
              {headline}
            </h1>

            <p
              className="text-lg leading-7 text-[#404040] max-w-[520px] mb-6"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
              }}
            >
              {subheadline}
            </p>

            <div className="max-w-[520px] mb-0">
              <p
                className="text-base leading-5"
                style={{
                  display: "none",
                }}
              >
                {description}
              </p>
            </div>

            <ul className="flex gap-1.5 flex-wrap mt-10">
              <li>
                <a
                  href={primaryButtonHref}
                  onClick={(e) => e.preventDefault()}
                  className="block cursor-pointer text-white bg-primary rounded-full px-[18px] py-[15px] text-base leading-4 whitespace-nowrap transition-all duration-150 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] hover:rounded-2xl"
                  
                >
                  {primaryButtonText}
                </a>
              </li>
              <li>
                <a
                  href={secondaryButtonHref}
                  onClick={(e) => e.preventDefault()}
                  className="block cursor-pointer text-[#202020] border border-[#202020] rounded-full px-[18px] py-[15px] text-base leading-4 whitespace-nowrap transition-all duration-150 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] hover:rounded-2xl"
                >
                  {secondaryButtonText}
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              ease: [0.645, 0.045, 0.355, 1],
              delay: 0.2,
            }}
            className="col-span-12 lg:col-span-6 bg-white rounded-[40px] flex justify-center items-center aspect-square overflow-hidden"
            style={{
              backgroundImage:
                "url(/study-group-african-people.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: "1",
            }}
          >
            <video
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              poster={posterSrc}
              className="block w-full h-full object-cover"
              style={{
                backgroundImage:
                  "url(/study-group-african-people.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: "1",
                display: "none",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
