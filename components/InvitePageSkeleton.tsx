"use client"

import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function InvitePageSkeleton() {
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
        <SiteHeader />

        <div className="min-h-screen bg-background animate-pulse">
          {/* HEADER */}
          <header className="sticky top-0 bg-background/95 backdrop-blur z-50 border-b border-border/40">
            <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <div className="h-8 w-64 bg-muted rounded mb-2" />
              <div className="h-4 w-96 bg-muted rounded" />
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

            {/* STEP INDICATOR */}
            <div className="mb-12">
              <div className="flex justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="h-3 w-20 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 1 SKELETON */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="h-5 w-40 bg-muted rounded" />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="p-4 rounded-lg border border-border/40"
                  >
                    <div className="h-4 w-3/4 bg-muted rounded mb-3" />
                    <div className="flex gap-2">
                      <div className="h-5 w-16 bg-muted rounded-full" />
                      <div className="h-5 w-12 bg-muted rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-border/40 my-8" />

            {/* STEP 2 SKELETON */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="h-5 w-48 bg-muted rounded" />
              </div>

              <div className="space-y-3 mb-4">
                {[1, 2].map((row) => (
                  <div key={row} className="flex gap-2">
                    <div className="flex-1 h-10 bg-muted rounded-lg" />
                    <div className="w-10 h-10 bg-muted rounded-lg" />
                  </div>
                ))}
              </div>

              <div className="h-10 w-full bg-muted rounded-lg" />
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-border/40 my-8" />

            {/* STEP 3 SKELETON */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="h-5 w-52 bg-muted rounded" />
              </div>

              <div className="h-24 w-full bg-muted rounded-lg mb-6" />
              <div className="h-12 w-full bg-muted rounded-lg" />
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-border/40 my-12" />

            {/* HISTORY SECTION */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <div className="w-5 h-5 bg-muted rounded" />
                <CardTitle>
                  <div className="h-5 w-40 bg-muted rounded" />
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((row) => (
                    <div
                      key={row}
                      className="h-12 w-full bg-muted rounded-lg"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}