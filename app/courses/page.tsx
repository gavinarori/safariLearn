"use client"

import type React from "react"
import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CourseExplorer } from "@/components/course-discovery"

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader onSearch={setSearchQuery} />
        <div className="flex flex-1 flex-col">
          <CourseExplorer searchQuery={searchQuery} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
