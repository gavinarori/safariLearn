"use client"

import type React from "react"

import type { ReactNode } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface LearningLayoutProps {
  sidebar: ReactNode
  children: ReactNode
}

export function LearningLayout({ sidebar, children }: LearningLayoutProps) {
  return (
    <SidebarProvider style={{ "--sidebar-width": "300px" } as React.CSSProperties}>
      {sidebar}
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/95 backdrop-blur-sm px-4 py-3">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium text-muted-foreground">Learning</span>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
