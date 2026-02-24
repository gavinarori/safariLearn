"use client"

import type * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconReport,
  IconSettings,
  IconUsers,
  IconBook,
  IconPlaylist,
  IconUser,
  IconBookmark,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
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

const data = {
  navMain: [
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
   
    {
      title: "Invite Colleagues",
      url: "/invite",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Profile",
      url: "/profile",
      icon: IconUser,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  )
}
