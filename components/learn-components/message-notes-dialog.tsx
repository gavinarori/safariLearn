"use client"

import React from "react"
import {
  MessageCircle,
  Keyboard,
  Settings,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { getMessagesByThread } from "@/services/discussionsService"
import type { DiscussionMessage } from "@/services/discussionsService"

const data = {
  nav: [
    { name: "Messages & media", icon: MessageCircle },
    { name: "Notes", icon: Keyboard },
    { name: "Advanced", icon: Settings },
  ],
}

export function MessageNotesDialog({
  open,
  onOpenChange,
  thread,
}: {
  open: boolean
  onOpenChange: (value: boolean) => void
  thread: any
}) {
  const [messages, setMessages] = React.useState<DiscussionMessage[]>([])
  const [loading, setLoading] = React.useState(false)

  // Load messages when dialog opens
  React.useEffect(() => {
    if (!open || !thread?.id) return

    async function load() {
      setLoading(true)
      try {
        const msgs = await getMessagesByThread(thread.id)
        setMessages(msgs)
      } catch (e) {
        console.error("Failed to load messages:", e)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [open, thread?.id])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">

        <DialogTitle className="sr-only">{thread?.title}</DialogTitle>
        <DialogDescription className="sr-only">
          Thread messages and details.
        </DialogDescription>

        <SidebarProvider className="items-start">

          {/* Left sidebar */}
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={item.name === "Messages & media"}>
                          <a href="#">
                            <item.icon />
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          {/* Main content */}
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Thread</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{thread?.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">

              {/* Thread starting post */}
              <div className="p-3 bg-muted/50 rounded-xl">
                {thread?.body}
              </div>

              {/* Loading indicator */}
              {loading && (
                <div className="text-sm text-muted-foreground">
                  Loading messages...
                </div>
              )}

              {/* Empty state */}
              {!loading && messages.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No messages yet — be the first to reply!
                </div>
              )}

              {/* Actual messages */}
              {!loading &&
                messages.map((msg) => (
                  <div key={msg.id} className="bg-muted/50 p-3 rounded-xl">
                    <div className="font-semibold text-sm">
                      {msg.user?.full_name || "Unknown User"}
                    </div>
                    <div className="text-sm whitespace-pre-line">
                      {msg.message}
                    </div>
                    <div className="text-xs opacity-60 mt-1">
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}

            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
