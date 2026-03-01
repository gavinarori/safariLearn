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
    question: "What is this platform and who is it built for?",
    answer:
      "This is an enterprise-grade corporate training platform designed for companies that want to deliver structured, company-paid learning to their employees. Focus on reading-first courses with built-in quizzes, manager performance tracking, and clear ROI visibility — no individual learner sign-ups, no creator marketplace, no community forums.",
  },
  {
    question: "How do companies enroll and manage their teams?",
    answer:
      "Admins (HR or L&D leads) bulk-enroll employees or entire departments via CSV upload, SSO, or HRIS integrations (e.g., Workday, BambooHR). Courses are assigned centrally, progress auto-syncs, and managers access real-time dashboards to monitor completion, quiz scores, and skill gaps — no manual chasing required.",
  },
  {
    question: "What makes the courses structured and effective?",
    answer:
      "Courses are reading-first with clear modules, key takeaways, and mandatory quizzes for assessment. This format drives higher retention and completion (often 90%+ in structured programs). Everything is company-curated or expert-provided — consistent quality, no user-generated content.",
  },
  {
    question: "How do managers track performance and impact?",
    answer:
      "Managers get dedicated dashboards showing team completion rates, average quiz scores, individual progress, and trends over time. Export reports for performance reviews or compliance. Tie training directly to business outcomes like faster onboarding or skills uplift.",
  },
  {
    question: "Does it support compliance and regulated training?",
    answer:
      "Yes — ideal for industries needing audit trails, certification tracking, and completion records. Features include mandatory quizzes, expiration reminders, and integration with HR systems for automated compliance reporting.",
  },
  {
    question: "Are there integrations with our existing tools?",
    answer:
      "Absolutely. Seamless connections with major HRIS (Workday, ADP, BambooHR), SSO providers (Okta, OneLogin), productivity suites (Microsoft Teams, Slack, Google Workspace), and analytics (Power BI). Auto-provision users, sync data, and embed insights where your team already works.",
  },
  {
    question: "Is it secure and enterprise-ready?",
    answer:
      "Built for scale: SOC 2 compliant, SSO/SAML support, role-based access (admins, managers, employees), data encryption, and audit logs. Companies control all access — no public profiles or external sharing.",
  },
  {
    question: "How does pricing work for companies?",
    answer:
      "Company-paid subscriptions based on active users or seats. Predictable pricing with volume discounts for larger teams. No per-learner fees for individuals — everything is organization-managed. Contact us for a custom quote or demo.",
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