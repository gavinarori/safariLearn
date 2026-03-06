"use client"

import type * as React from "react"
import { useEffect, useState } from "react"
import {
  IconDashboard,
  IconInnerShadowTop,
  IconUsers,
  IconBook,
  IconUser,
  IconBookmark,
} from "@tabler/icons-react"

import { createClient } from "@/superbase/client"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const supabase = createClient()

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) return

      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", auth.user.id)
        .single()

      setRole(data?.role ?? null)
    }

    fetchUserRole()
  }, [])

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Explore Courses",
      url: "/courses",
      icon: IconBook,
    },
    {
      title: "My Learning",
      url: "/my-learning",
      icon: IconBookmark,
    },
    ...(role === "company_admin"
      ? [
          {
            title: "Invite Colleagues",
            url: "/invite",
            icon: IconUsers,
          },
        ]
      : []),
  ]

  const navSecondary = [
    {
      title: "Profile",
      url: "/profile",
      icon: IconUser,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                  <IconInnerShadowTop className="size-4" />
                </div>
                <span className="text-base font-semibold">safariLearn</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}