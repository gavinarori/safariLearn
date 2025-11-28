"use client"

import * as React from "react"
import {
  MessageSquare,
  PlusCircle,
  Bookmark,
  User2,
  MessageCircle,
  Search,
} from "lucide-react"

import { Sidebar } from "@/components/ui/sidebar"
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

import {
  getThreadsByCourseId,
  type DiscussionThread,
} from "@/services/discussionsService"

import { subscribeToCourseThreads } from "@/services/websocketService"

// Props: pass courseId to load correct discussions
export function DiscussionSidebar({
  courseId,
}: {
  courseId: any
}) {
  const { setOpen } = useSidebar()

  const [activeTab, setActiveTab] = React.useState("threads")
  const [threads, setThreads] = React.useState<DiscussionThread[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")

  /* 🔥 Load threads */

   async function loadThreads() {
    const data = await getThreadsByCourseId(courseId)
    setThreads(data)
  }

  React.useEffect(() => {
    if (!courseId) return
    loadThreads()
  }, [courseId])

 

React.useEffect(() => {
  if (!courseId) return;

  const channel = subscribeToCourseThreads(courseId, (newThread) => {
    setThreads((prev) => [newThread, ...prev]);
  });

  // cleanup must be sync
  return () => {
    // call async unsubscribe but don't return the Promise
    channel.unsubscribe?.();
  };
}, [courseId]);


  const filteredThreads = threads.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const navMenu = [
    { title: "All Threads", value: "threads", icon: MessageSquare },
    { title: "My Posts", value: "myposts", icon: User2 },
    { title: "Bookmarked", value: "bookmarks", icon: Bookmark },
  ]

  return (
    <Sidebar collapsible="icon" className="overflow-hidden bg-white">
      {/* -------- Left Compact Section -------- */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r bg-gray-50"
      >
        <SidebarHeader className="p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="flex flex-col items-center gap-1"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">Discussions</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {navMenu.map((item) => (
              <SidebarMenuItem key={item.value}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={activeTab === item.value}
                  onClick={() => {
                    setActiveTab(item.value)
                    setOpen(true)
                  }}
                >
                  <item.icon />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      {/* -------- Main Discussion Panel -------- */}
      <Sidebar collapsible="none" className="hidden flex-1 flex-col md:flex">
        <SidebarHeader className="border-b p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">
              {activeTab === "threads" && "All Threads"}
              {activeTab === "myposts" && "My Posts"}
              {activeTab === "bookmarks" && "Bookmarks"}
            </h2>

            <button
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-white text-sm hover:bg-primary/90"
              onClick={() => console.log("Open create thread modal")}
            >
              <PlusCircle className="h-4 w-4" />
              New Thread
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <SidebarInput
              className="pl-10"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </SidebarHeader>

        {/* -------- Thread List -------- */}
        <SidebarContent className="overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              {filteredThreads.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No threads yet. Be the first to start a conversation!
                </div>
              )}

              {filteredThreads.map((thread) => (
                <SidebarMenuItem key={thread.id}>
                  <SidebarMenuButton
                    asChild
                    className="flex flex-col items-start gap-2 p-4 hover:bg-gray-50"
                  >
                    <a href={`/course/${courseId}/discussion/${thread.id}`}>
                      <div className="flex w-full items-center gap-2">
                        <span className="font-medium text-sm">
                          {thread.title}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {new Date(thread.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {thread.body}
                      </span>

                      {thread.user && (
                        <div className="flex items-center gap-2 mt-1">
                          <img
                            src={thread.user.avatar_url}
                            className="h-5 w-5 rounded-full"
                          />
                          <span className="text-[11px] text-muted-foreground">
                            {thread.user.full_name}
                          </span>
                        </div>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
