"use client"

import type React from "react"
import type { ReactNode } from "react"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ModeSwitcher } from "../toggle-theme"
import { BookOpen } from "lucide-react"

interface LearningLayoutProps {
  sidebar: ReactNode
  children: ReactNode
}

export function LearningLayout({
  sidebar,
  children,
}: LearningLayoutProps) {
  return (
    <SidebarProvider
      style={{ "--sidebar-width": "300px" } as React.CSSProperties}
    >
      {sidebar}

      {/* SPACE AROUND */}
      <SidebarInset className="flex flex-col min-h-screen bg-background p-[3px]">

        {/* ROUNDED CONTAINER */}
        <div className="flex flex-col min-h-screen rounded-md overflow-hidden border bg-background">

          {/* HEADER */}
          <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background/95 backdrop-blur-md px-4 py-4 shadow-sm">
            <SidebarTrigger className="-ml-1 hover:bg-muted transition-colors" />

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>

              <span className="text-sm font-semibold text-foreground">
                Learning
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <ModeSwitcher />
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 overflow-auto bg-gradient-to-b from-background to-muted/10">
            {children}
          </main>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}