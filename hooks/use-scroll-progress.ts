"use client"

import type React from "react"

import { useEffect } from "react"

export function useScrollProgress(
  containerRef: React.RefObject<HTMLDivElement>,
  completedTopics: Set<string>,
  setCompletedTopics: (topics: Set<string>) => void,
) {
  const completedSections = new Set(completedTopics)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const sections = container.querySelectorAll("[data-section-id]")

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const sectionId = section.getAttribute("data-section-id")

        // Mark as completed if the section is in viewport
        if (sectionId && rect.top < window.innerHeight / 2) {
          completedSections.add(sectionId)
          setCompletedTopics(new Set(completedSections))
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [completedTopics, setCompletedTopics])

  return { completedSections }
}
