"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

type CaseStudy = {
  id: string
  company: string
  logo: React.ReactNode
  title: string
  features: string[]
  quote: string
  attribution: string
  accentColor: string
  cards: {
    type: "progress" | "metrics" | "quiz" | "onboarding"
    delay: number
    zIndex: number
  }[]
}

const caseStudies: CaseStudy[] = [
  {
    id: "tech-scaleup",
    company: "Mid-Market Tech Company",
    logo: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#16b364" strokeWidth="2" />
        <path d="M8 12L11 15L16 9" stroke="#16b364" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Closed critical skills gaps across engineering teams with structured reading-first courses and manager-tracked progress.",
    features: ["Company Enrollment", "Quiz Assessments", "Manager Dashboards"],
    quote: "We reduced onboarding time by 45% and saw quiz completion rates hit 92%. Managers now have clear visibility into team performance without chasing reports.",
    attribution: "Head of L&D, 300-employee SaaS company",
    accentColor: "#16b364",
    cards: [
      { type: "progress", delay: 0, zIndex: 1 },
      { type: "metrics", delay: 0.1, zIndex: 2 },
    ],
  },

  {
    id: "finance-team",
    company: "Financial Services Firm",
    logo: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#3b82f6" />
        <path d="M7 12H17M12 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Achieved 350%+ ROI by standardizing compliance and skills training with built-in quizzes and real-time tracking.",
    features: ["Structured Courses", "Performance Insights", "Completion Tracking"],
    quote: "Managers love the dashboards — they spot at-risk employees early. Overall training admin time dropped 55%, and we proved clear ROI to leadership.",
    attribution: "Training Director, Mid-sized Bank",
    accentColor: "#3b82f6",
    cards: [
      { type: "quiz", delay: 0, zIndex: 1 },
      { type: "metrics", delay: 0.1, zIndex: 2 },
    ],
  },

  {
    id: "retail-chain",
    company: "Retail Enterprise",
    logo: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="#0A0D12">
        <circle cx="12" cy="12" r="10" fill="#0A0D12" />
        <path
          d="M8 10C8 8.89543 8.89543 8 10 8H14C15.1046 8 16 8.89543 16 10V14C16 15.1046 15.1046 16 14 16H10C8.89543 16 8 15.1046 8 14V10Z"
          stroke="white"
          strokeWidth="2"
        />
      </svg>
    ),
    title: "Boosted employee performance and reduced turnover through consistent, company-paid training programs.",
    features: ["Reading-First Modules", "Quiz & Assessment", "Team Progress"],
    quote: "Completion rates jumped to 90%+ with reading-focused content and manager oversight. We saw measurable uplift in store metrics tied to training.",
    attribution: "HR Leader, Multi-location Retailer",
    accentColor: "#0A0D12",
    cards: [
      { type: "progress", delay: 0, zIndex: 1 },
      { type: "onboarding", delay: 0.1, zIndex: 2 },
    ],
  },

  {
    id: "healthcare-provider",
    company: "Healthcare Organization",
    logo: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#155eef" />
        <path
          d="M8 12L11 9M8 12L11 15M16 9L13 12M16 15L13 12"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Streamlined regulatory training and accelerated team readiness with manager dashboards and analytics.",
    features: ["Compliance Courses", "Real-Time Tracking", "ROI Reporting"],
    quote: "We cut training delivery costs by 50% while hitting 95% completion. Managers use insights to coach effectively — it's transformed how we develop staff.",
    attribution: "L&D Manager, Regional Healthcare Group",
    accentColor: "#155eef",
    cards: [
      { type: "quiz", delay: 0, zIndex: 1 },
      { type: "onboarding", delay: 0.1, zIndex: 2 },
    ],
  },
]

// FeatureBadge (unchanged, but features now corporate)
const FeatureBadge = ({ name }: { name: string }) => {
  // ... (keep your existing icon logic or simplify; omitted for brevity)
  return (
    <div className="flex items-center gap-2 bg-white/75 shadow-sm border border-black/5 rounded-lg px-2 py-1 text-sm font-medium text-foreground">
      {/* Icon logic here if needed */}
      {name}
    </div>
  )
}

// New themed cards (replacing old ones)
const TeamProgressDashboardCard = ({
  accentColor,
  delay,
  zIndex,
}: {
  accentColor: string
  delay: number
  zIndex: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay }}
      className="absolute w-[380px] rounded-xl p-6 backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 8px 32px 0 rgba(0, 0, 0, 0.12)",
        filter: "drop-shadow(0 4px 6px rgba(30, 30, 44, 0.15))",
        transform: "translate(-200px, -80px)",
        zIndex,
      }}
    >
      <div className="flex flex-col space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Team Completion Overview</h4>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" />Engineering</div>
            <span className="text-sm font-semibold text-green-600">94%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" />Sales</div>
            <span className="text-sm font-semibold text-blue-600">91%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" />Support</div>
            <span className="text-sm font-semibold text-purple-600">88%</span>
          </div>
        </div>
        <div className="pt-3 border-t border-border/50 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">45</span> employees on track • 8 need attention
        </div>
      </div>
    </motion.div>
  )
}

const PerformanceMetricsCard = ({
  accentColor,
  delay,
  zIndex,
}: {
  accentColor: string
  delay: number
  zIndex: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay }}
      className="absolute w-[400px] rounded-xl p-6 backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 8px 32px 0 rgba(0, 0, 0, 0.12)",
        filter: "drop-shadow(0 4px 6px rgba(30, 30, 44, 0.15))",
        transform: "translate(-180px, -60px)",
        zIndex,
      }}
    >
      <div className="flex flex-col space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Performance Impact</h4>
          <span className="text-xs text-muted-foreground">Last Quarter</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-foreground">+42%</div>
            <div className="text-xs text-muted-foreground mt-1">Productivity</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-foreground">-55%</div>
            <div className="text-xs text-muted-foreground mt-1">Admin Time</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-foreground">350%</div>
            <div className="text-xs text-muted-foreground mt-1">ROI</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Skills Uplift</span>
            <span className="font-semibold text-foreground">+28%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "87%", backgroundColor: accentColor }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const QuizResultsSummaryCard = ({
  accentColor,
  delay,
  zIndex,
}: {
  accentColor: string
  delay: number
  zIndex: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay }}
      className="absolute w-[380px] rounded-xl p-6 backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 8px 32px 0 rgba(0, 0, 0, 0.12)",
        filter: "drop-shadow(0 4px 6px rgba(30, 30, 44, 0.15))",
        transform: "translate(-190px, -70px)",
        zIndex,
      }}
    >
      <div className="flex flex-col space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Quiz Performance Summary</h4>
          <span className="text-xs text-muted-foreground">This Month</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <span className="text-sm text-foreground">Avg. Score</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "88%" }} />
              </div>
              <span className="text-xs font-semibold text-foreground">88%</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <span className="text-sm text-foreground">Completion Rate</span>
            <span className="text-xs font-semibold text-green-600">92%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <span className="text-sm text-foreground">Improvement Trend</span>
            <span className="text-xs font-semibold text-blue-600">+15%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const OnboardingAccelerationCard = ({
  accentColor,
  delay,
  zIndex,
}: {
  accentColor: string
  delay: number
  zIndex: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay }}
      className="absolute w-[380px] rounded-xl p-6 backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 8px 32px 0 rgba(0, 0, 0, 0.12)",
        filter: "drop-shadow(0 4px 6px rgba(30, 30, 44, 0.15))",
        transform: "translate(-190px, -70px)",
        zIndex,
      }}
    >
      <div className="flex flex-col space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center " style={{ backgroundColor: accentColor }}>
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><rect x="3" y="3" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" /></svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Onboarding Impact</h4>
              <p className="text-xs text-muted-foreground">New Hires Q4</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <span className="text-sm text-foreground">Time to Productivity</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "60%" }} />
              </div>
              <span className="text-xs font-semibold text-foreground">-45%</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <span className="text-sm text-foreground">Completion Rate</span>
            <span className="text-xs font-semibold text-green-600">93%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <span className="text-sm text-foreground">Admin Blocks Reduced</span>
            <span className="text-xs font-semibold text-green-600">Low</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const CaseStudiesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const currentStudy = caseStudies[currentIndex]

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    autoPlayRef.current = setInterval(() => nextSlide(), 5000)
  }

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
      autoPlayRef.current = null
    }
  }

  useEffect(() => {
    if (isAutoPlaying) startAutoPlay()
    else stopAutoPlay()
    return () => stopAutoPlay()
  }, [isAutoPlaying, currentIndex])

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % caseStudies.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + caseStudies.length) % caseStudies.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 1000 : -1000, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 1000 : -1000, opacity: 0 }),
  }

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center py-24 px-8"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="max-w-7xl w-full">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h1 className="text-[40px] leading-tight font-normal text-foreground mb-6 tracking-tight">
            Corporate Success Stories
          </h1>
          <p className="text-lg leading-7 text-muted-foreground max-w-2xl mx-auto">
            See how growing companies use our platform to deliver structured training, track manager insights, and drive measurable ROI.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Testimonial */}
          <div className="space-y-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStudy.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="space-y-6"
              >
                <div className="text-foreground/60">{currentStudy.logo}</div>

                <h2 className="text-4xl font-bold text-foreground leading-tight tracking-tight">
                  {currentStudy.title}
                </h2>

                <div className="flex flex-wrap gap-2">
                  {currentStudy.features.map((feature, idx) => (
                    <FeatureBadge key={idx} name={feature} />
                  ))}
                </div>

                <blockquote className="border-l-4 border-primary pl-6 py-2">
                  <p className="text-lg leading-7 text-foreground/80 italic mb-3">
                    "{currentStudy.quote}"
                  </p>
                  <footer className="text-sm text-muted-foreground">
                    {currentStudy.attribution}
                  </footer>
                </blockquote>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                {caseStudies.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={prevSlide} className="p-2 rounded-lg border border-border hover:bg-accent transition-colors" aria-label="Previous">
                  {/* Left arrow SVG */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button onClick={nextSlide} className="p-2 rounded-lg border border-border hover:bg-accent transition-colors" aria-label="Next">
                  {/* Right arrow SVG */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Animated Cards (Manager Dashboard Style) */}
          <div className="relative h-[500px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStudy.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {currentStudy.cards.map((card) => {
                  if (card.type === "progress") return <TeamProgressDashboardCard key={card.type} accentColor={currentStudy.accentColor} delay={card.delay} zIndex={card.zIndex} />
                  if (card.type === "metrics") return <PerformanceMetricsCard key={card.type} accentColor={currentStudy.accentColor} delay={card.delay} zIndex={card.zIndex} />
                  if (card.type === "quiz") return <QuizResultsSummaryCard key={card.type} accentColor={currentStudy.accentColor} delay={card.delay} zIndex={card.zIndex} />
                  if (card.type === "onboarding") return <OnboardingAccelerationCard key={card.type} accentColor={currentStudy.accentColor} delay={card.delay} zIndex={card.zIndex} />
                  return null
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}