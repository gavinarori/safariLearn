"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

type StatItem = {
  value: string
  description: string
  delay: number
}

type DataPoint = {
  id: number
  left: number
  top: number
  height: number
  direction: "up" | "down"
  delay: number
}

const stats: StatItem[] = [
  {
    value: "40–60%",
    description: "Faster training delivery\ncompared to traditional programs",
    delay: 0,
  },
  {
    value: "90%+",
    description: "Average completion rate\nacross enrolled teams",
    delay: 0.2,
  },
  {
    value: "200+",
    description: "Companies training teams\nwith structured learning",
    delay: 0.4,
  },
  {
    value: "4.8 / 5",
    description: "Rated by managers\nand L&D leaders",
    delay: 0.6,
  },
]

const generateDataPoints = (): DataPoint[] => {
  const points: DataPoint[] = []
  const baseLeft = 1
  const spacing = 32

  for (let i = 0; i < 50; i++) {
    const direction = i % 2 === 0 ? "down" : "up"
    const height = Math.floor(Math.random() * 120) + 88
    const top =
      direction === "down"
        ? Math.random() * 150 + 250
        : Math.random() * 100 - 80

    points.push({
      id: i,
      left: baseLeft + i * spacing,
      top,
      height,
      direction,
      delay: i * 0.035,
    })
  }
  return points
}

export const CorporateTrainingHero = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [dataPoints] = useState<DataPoint[]>(generateDataPoints())
  const [typingComplete, setTypingComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => setTypingComplete(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-28">

        <div className="grid grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* LEFT */}
          <div className="col-span-12 md:col-span-6 relative z-10">

            {/* TAGLINE */}
            <div className="mb-8">
              <div className="relative inline-flex items-center font-mono uppercase text-xs tracking-wider text-primary/80">

                <div className="flex items-center gap-1 overflow-hidden">

                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "auto" }}
                    transition={{ duration: 0.8 }}
                    className="block whitespace-nowrap overflow-hidden"
                  >
                    Built for corporate training teams
                  </motion.span>

                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: typingComplete ? [1, 0, 1, 0] : 0,
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                    className="block w-1.5 h-3 bg-primary rounded-sm"
                  />

                </div>
              </div>
            </div>

            {/* TITLE */}
            <h1 className="text-4xl lg:text-5xl font-medium leading-tight tracking-tight text-foreground mb-6">

              Train your entire team faster{" "}
              <span className="opacity-50">
                with structured, company-managed courses
                and real-time progress tracking.
              </span>

            </h1>

            {/* DESCRIPTION */}
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">

              Enroll employees into focused learning programs with quizzes,
              assessments, and manager dashboards. Track completion,
              monitor performance, and deliver consistent training —
              all without individual sign-ups or external marketplaces.

            </p>

            {/* CTA */}
            <button
              className="
                inline-flex items-center gap-2
                h-10 px-6
                text-sm font-medium
                rounded-lg
                bg-primary text-primary-foreground
                hover:opacity-90
                transition
                shadow-sm hover:shadow-md
              "
              onClick={()=>{router.push("/waitlist")}}
            >
              Book demo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

          </div>


          {/* RIGHT ANIMATION (unchanged) */}
          <div className="col-span-12 md:col-span-6">
            <div className="relative w-full h-[420px] -ml-[180px]">
              <div className="absolute top-0 left-[300px] w-[680px] h-[420px] pointer-events-none">

                <div className="relative w-full h-full">

                  {dataPoints.map((point) => (
                    <motion.div
                      key={point.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={
                        isVisible
                          ? {
                              opacity: [0, 1, 1],
                              height: [0, point.height, point.height],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        delay: point.delay,
                        ease: [0.5, 0, 0.01, 1],
                      }}
                      className="absolute w-1.5 rounded-[3px]"
                      style={{
                        left: `${point.left}px`,
                        top: `${point.top}px`,
                        background:
                          point.direction === "down"
                            ? "linear-gradient(rgb(180 200 180) 0%, rgb(180 200 180) 10%, rgba(156, 217, 93, 0.1) 40%, rgba(113, 210, 240, 0) 75%)"
                            : "linear-gradient(to top, rgb(180 200 180) 0%, rgb(180 200 180) 10%, rgba(156, 217, 93, 0.1) 40%, rgba(113, 210, 240, 0) 75%)",
                      }}
                    />
                  ))}

                </div>
              </div>
            </div>
          </div>


          {/* STATS */}
          <div className="col-span-12 mt-10">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 1,
                    delay: stat.delay,
                  }}
                  className="flex flex-col gap-1"
                >
                  <p className="text-2xl font-semibold">
                    {stat.value}
                  </p>

                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {stat.description}
                  </p>
                </motion.div>
              ))}

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}