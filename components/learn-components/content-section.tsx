"use client"

import { useState } from "react"
import { ChevronDown, BookOpen, Image, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { ModuleSection } from "@/services/lessonsService"

interface ContentSectionProps {
  section: ModuleSection
}

export function ContentSection({ section }: ContentSectionProps) {
  const [expanded, setExpanded] = useState(section.type !== "text")

  const typeStyles = {
    text: { 
      icon: BookOpen, 
      bg: "bg-blue-50 dark:bg-blue-950/30", 
      border: "border-blue-200 dark:border-blue-800",
      color: "text-blue-700 dark:text-blue-300",
      badge: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
    },
    image: { 
      icon: Image, 
      bg: "bg-purple-50 dark:bg-purple-950/30", 
      border: "border-purple-200 dark:border-purple-800",
      color: "text-purple-700 dark:text-purple-300",
      badge: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
    },
    example: { 
      icon: Lightbulb, 
      bg: "bg-amber-50 dark:bg-amber-950/30", 
      border: "border-amber-200 dark:border-amber-800",
      color: "text-amber-700 dark:text-amber-300",
      badge: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
    },
  } as any

  const style = typeStyles[section.type]
  const IconComponent = style.icon

  if (section.type === "text" && !section.key_points) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${style.badge}`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-semibold">{section.title}</h3>
          </div>
          {section.subtitle && <p className="text-muted-foreground ml-11">{section.subtitle}</p>}
        </div>
        <div className="text-foreground/85 leading-relaxed whitespace-pre-wrap text-base">{section.content}</div>

        {section.callout && (
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex gap-3">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">{section.callout}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={`overflow-hidden transition-all border ${style.border} ${style.bg} hover:shadow-md`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-expanded={expanded}
        aria-label={`Toggle ${section.type} section: ${section.title}`}
      >
        <div className="flex items-center gap-4 flex-1 text-left">
          <div className={`p-2.5 rounded-lg ${style.badge} flex-shrink-0`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground">{section.title}</h4>
            {section.subtitle && <p className="text-xs text-muted-foreground mt-1">{section.subtitle}</p>}
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <CardContent className="px-6 py-6 border-t space-y-6">
          {section.type === "image" && section.image_url && (
            <div className="relative w-full h-80 rounded-xl overflow-hidden bg-muted/50 border border-border/50">
              <img
                src={section.image_url || "/placeholder.svg"}
                alt={section.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">{section.content}</div>

          {section.key_points && section.key_points.length > 0 && (
            <div className="bg-background/60 border border-border/50 rounded-xl p-5 space-y-4">
              <h5 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <span className="text-lg">✓</span> Key Points
              </h5>
              <ul className="space-y-3">
                {section.key_points.map((point, idx) => (
                  <li key={idx} className="flex gap-3 text-sm leading-relaxed">
                    <span className="text-primary font-semibold flex-shrink-0 pt-1">•</span>
                    <span className="text-foreground/90">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {section.callout && (
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5 flex gap-4">
              <span className="text-xl flex-shrink-0" role="img" aria-label="Warning">⚠️</span>
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">{section.callout}</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
