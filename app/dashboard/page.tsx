"use client"

import { useEffect, useState } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable, Course } from "@/components/data-table"
import { EmployeesProgressTable } from "@/components/employees-data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { createClient } from "@/superbase/client"
import {
  UserDashboardService,
  EmployeeCourseProgress,
} from "@/services/userDashboardService"



function TableSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b">
          <div className="h-4 w-40 bg-muted rounded" />
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      ))}
    </div>
  )
}



export default function Page() {
  const [courses, setCourses] = useState<Course[]>([])
  const [employees, setEmployees] = useState<EmployeeCourseProgress[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const service = new UserDashboardService(supabase)

      const { data } = await supabase.auth.getUser()
      const userId = data.user?.id
      if (!userId) return

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single()

      const userRole = userData?.role ?? null
      setRole(userRole)


      const rows = await service.getEnrolledCourses()

      const mapped: Course[] =
        rows?.map((r: any, i: number) => ({
          id: r.course_id ?? String(i),
          courseName: r.course_name,
          status:
            r.status === "completed"
              ? "Completed"
              : "In Progress",
          progress: r.progress_percent ?? 0,
          lessonsCompleted: r.completed_lessons ?? 0,
          totalLessons: r.total_lessons ?? 0,
        })) ?? []

      setCourses(mapped)
      setLoadingCourses(false)

      if (userRole === "company_admin") {
        const progress = await service.getCompanyEmployeesCourseProgress()
        setEmployees(progress)
      }

      setLoadingEmployees(false)
    }

    load()
  }, [])



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

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">

            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

              <SectionCards />

              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>

    
              <div className="px-4 lg:px-6">
                {loadingCourses ? (
                  <TableSkeleton />
                ) : (
                  <DataTable data={courses} />
                )}
              </div>

              {role === "company_admin" && (
                <div className="px-4 lg:px-6">
                  {loadingEmployees ? (
                    <TableSkeleton />
                  ) : (
                    <EmployeesProgressTable data={employees} />
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}