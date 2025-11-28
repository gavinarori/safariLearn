"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

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
    value: "10k+",
    description: "Active learners\nworldwide",
    delay: 0,
  },
  {
    value: "500+",
    description: "Lessons published\nby experts",
    delay: 0.2,
  },
  {
    value: "150+",
    description: "Communities & courses\nto explore",
    delay: 0.4,
  },
  {
    value: "4.9/5",
    description: "Average learner\nsatisfaction",
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
    const top = direction === "down" ? Math.random() * 150 + 250 : Math.random() * 100 - 80

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

export const BankingScaleHero = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [dataPoints] = useState<DataPoint[]>(generateDataPoints())
  const [typingComplete, setTypingComplete] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => setTypingComplete(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-8 py-24 pt-16">
        <div className="grid grid-cols-12 gap-5 gap-y-16">
        
          {/* LEFT SECTION */}
          <div className="col-span-12 md:col-span-6 relative z-10">

            {/* HEADER TAGLINE */}
            <div
              className="relative h-6 inline-flex items-center font-mono uppercase text-xs text-teal-700 dark:text-teal-300 mb-12 px-2"
            >
              <div className="flex items-center gap-0.5 overflow-hidden">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="block whitespace-nowrap overflow-hidden text-primary dark:text-primary-foreground"
                >
                  Built for modern learning
                </motion.span>

                {/* Typing cursor */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: typingComplete ? [1, 0, 1, 0] : 0,
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="block w-1.5 h-3 bg-teal-700 dark:bg-teal-300 rounded-sm"
                />
              </div>
            </div>

            {/* TITLE */}
            <h2 className="text-[40px] font-normal leading-tight tracking-tight text-gray-900 dark:text-gray-100 mb-6">
              Powering the next generation of learning{" "}
              <span className="opacity-40">
                with courses, community, and real-time collaboration.
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p className="text-lg leading-6 text-gray-700 dark:text-gray-300 opacity-80 mt-0 mb-6">
              Our platform brings together expert-led courses, in-lesson discussions, and a vibrant
              learning community — all in one place. Learn, connect, and grow with people who share your goals.
            </p>

            {/* CTA BUTTON */}
            <button
              className="
                relative inline-flex justify-center items-center leading-4 text-center cursor-pointer whitespace-nowrap
                outline-none font-medium h-9 px-4 mt-5 text-sm group rounded-lg
                bg-white/50 dark:bg-black/40 backdrop-blur-sm
                text-gray-800 dark:text-gray-100
                border border-gray-200 dark:border-gray-700
                shadow-sm hover:shadow-md transition-all duration-200
              "
            >
              <span className="flex items-center gap-1">
                Explore the platform
                <ArrowRight className="w-4 h-4 -mr-1 transition-transform duration-150 group-hover:translate-x-1" />
              </span>
            </button>
          </div>

          {/* RIGHT SECTION — ANIMATED HEIGHT LINES */}
          <div className="col-span-12 md:col-span-6">
            <div className="relative w-full h-[416px] -ml-[200px]">
              <div className="absolute top-0 left-[302px] w-[680px] h-[416px] pointer-events-none">
                <div className="relative w-full h-full">

                  {dataPoints.map((point) => (
                    <motion.div
                      key={point.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={
                        isVisible
                          ? { opacity: [0, 1, 1], height: [0, point.height, point.height] }
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

                        // Neutral gradients for both dark & light
                        background:
                          point.direction === "down"
                            ? "linear-gradient(rgb(180 200 180) 0%, rgb(180 200 180) 10%, rgba(156, 217, 93, 0.1) 40%, rgba(113, 210, 240, 0) 75%)"
                            : "linear-gradient(to top, rgb(180 200 180) 0%, rgb(180 200 180) 10%, rgba(156, 217, 93, 0.1) 40%, rgba(113, 210, 240, 0) 75%)",
                      }}
                    >
                      {/* Animated dot */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={isVisible ? { opacity: [0, 1] } : {}}
                        transition={{ duration: 0.3, delay: point.delay + 1.7 }}
                        className="absolute -left-[1px] w-2 h-2 bg-primary dark:bg-primary-foreground rounded-full"
                        style={{
                          top: point.direction === "down" ? "0px" : `${point.height - 8}px`,
                        }}
                      />
                    </motion.div>
                  ))}

                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM STATS */}
          <div className="col-span-12">
            <div className="overflow-visible pb-5">
              <div className="grid grid-cols-12 gap-5 relative z-10">

                {stats.map((stat, index) => (
                  <div key={index} className="col-span-6 md:col-span-3">
                    <motion.div
                      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                      animate={
                        isVisible
                          ? { opacity: [0, 1, 1], y: [20, 0, 0], filter: ["blur(4px)", "blur(0px)", "blur(0px)"] }
                          : {}
                      }
                      transition={{ duration: 1.5, delay: stat.delay }}
                      className="flex flex-col gap-2"
                    >
                      <p className="text-xs leading-[13.2px] text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {stat.description}
                      </p>
                    </motion.div>
                  </div>
                ))}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
