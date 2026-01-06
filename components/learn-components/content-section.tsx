"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { ModuleSection } from "@/services/lessonsService"

interface ContentSectionProps {
  section: ModuleSection
}

export function ContentSection({ section }: ContentSectionProps) {
  const [expanded, setExpanded] = useState(section.type !== "text")

  const typeStyles = {
    text: { icon: "📝", bg: "bg-blue-100 dark:bg-blue-900", color: "text-blue-700 dark:text-blue-300" },
    image: { icon: "🖼️", bg: "bg-purple-100 dark:bg-purple-900", color: "text-purple-700 dark:text-purple-300" },
    example: { icon: "💡", bg: "bg-amber-100 dark:bg-amber-900", color: "text-amber-700 dark:text-amber-300" },
  } as any

  const style = typeStyles[section.type]

  if (section.type === "text" && !section.key_points) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
          {section.subtitle && <p className="text-muted-foreground">{section.subtitle}</p>}
        </div>
        <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{section.content}</div>

        {section.callout && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">⚠️ {section.callout}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${style.bg}`}>{style.icon}</div>
          <div>
            <h4 className="font-semibold text-sm">{section.title}</h4>
            {section.subtitle && <p className="text-xs text-muted-foreground">{section.subtitle}</p>}
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <CardContent className="px-6 py-4 border-t space-y-4">
          {section.type === "image" && section.image_url && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
              <img
                src={section.image_url || "/placeholder.svg"}
                alt={section.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{section.content}</div>

          {section.key_points && section.key_points.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h5 className="font-semibold text-sm">Key Points:</h5>
              <ul className="space-y-2">
                {section.key_points.map((point, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <span className="text-primary font-bold flex-shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {section.callout && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">⚠️ {section.callout}</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
