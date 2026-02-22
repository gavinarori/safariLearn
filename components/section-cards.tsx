"use client"

import { useEffect, useState } from "react"
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { createClient } from "@/superbase/client"
import { UserDashboardService, UserDashboardSummary } from "@/services/userDashboardService"

export function SectionCards() {
  const [data, setData] = useState<UserDashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient()
        const service = new UserDashboardService(supabase)

        const summary = await service.getSummary()
        setData(summary)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading metrics...</div>
  }

  if (!data) {
    return <div className="p-6 text-destructive">Failed to load dashboard data</div>
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      {/* TOTAL COURSES */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Courses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.total_courses}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Enrolled Courses <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total courses assigned to you
          </div>
        </CardFooter>
      </Card>

      {/* COMPLETED */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Completed Courses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.completed_courses}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Done
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Successfully finished <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Completed learning paths
          </div>
        </CardFooter>
      </Card>

      {/* IN PROGRESS */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>In Progress</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.courses_in_progress}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              Ongoing
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Courses still running <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Continue where you left off
          </div>
        </CardFooter>
      </Card>

      {/* AVG PROGRESS */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Progress</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.avg_progress_percent}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Progress
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Learning performance <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Overall course completion rate
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}