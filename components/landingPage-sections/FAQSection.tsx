"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

type FAQSectionProps = {
  title?: string
  faqs?: FAQItem[]
}

const defaultFAQs: FAQItem[] = [
  {
    question: "What is this platform and who is it for?",
    answer:
      "Our platform is a modern Learning Management System designed for trainers, instructors, and organizations who want to deliver structured courses online. Learners can enroll, watch lessons, follow structured curriculums, participate in discussions, and track learning progress — all in one place.",
  },
  {
    question: "How do trainers create and manage their courses?",
    answer:
      "Trainers can easily create courses through a simple dashboard. Upload video lessons, add modules, create curriculums, manage learners, and engage with them through course discussions. No technical knowledge is required — everything is handled through an intuitive interface.",
  },
  {
    question: "Do learners need an account to access the courses?",
    answer:
      "Yes. Learners create a free account to enroll in courses, access content, join discussions, and track their progress. Some courses may be free while others may require enrollment or payment, depending on the trainer.",
  },
  {
    question: "Does the platform support discussions and forums?",
    answer:
      "Absolutely. Each course includes a built-in discussion space where learners can ask questions, interact with trainers, and participate in topic-based forums. Discussions are organized per lesson and per course for easy navigation.",
  },
  {
    question: "Can the platform handle video content?",
    answer:
      "Yes. Trainers can upload or link video lessons directly into the platform. Videos are optimized for smooth playback across all devices, and each lesson can include descriptions, materials, and discussions beneath it.",
  },
  {
    question: "Is there a limit to how many courses I can create?",
    answer:
      "No. Trainers can create as many courses, modules, and lessons as they need. The platform is built to scale as your content and learner base grows.",
  },
  {
    question: "How do payments work for paid courses?",
    answer:
      "Trainers can mark courses as free or paid. When payments are enabled, learners can purchase courses through a secure payment checkout. Trainers receive payouts for their enrolled learners depending on their chosen plan.",
  },
  {
    question: "Is the platform mobile-friendly?",
    answer:
      "Yes. Both trainers and learners can access the platform on desktop, tablet, or mobile. All pages, lessons, and discussions are fully responsive.",
  },
]

export const FAQSection = ({ title = "Frequently asked questions", faqs = defaultFAQs }: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full py-24 px-4 md:px-8 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left Column - Title */}
          <div className="lg:col-span-4">
            <h2 className="text-[32px] md:text-[40px] leading-tight font-normal tracking-tight sticky top-24">
              {title}
            </h2>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="lg:col-span-8 space-y-2 md:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-border last:border-b-0"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between py-4 md:py-6 text-left group hover:opacity-80 transition-opacity duration-150"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-base md:text-lg font-medium">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="flex-shrink-0"
                  >
                    <Plus className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 md:pb-6">
                        <p className="text-sm md:text-base text-muted-foreground leading-6 md:leading-7">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
