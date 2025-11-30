"use client"

import * as React from "react"
import { MessageSquare, PlusCircle, Bookmark, User2, MessageCircle, Search } from "lucide-react"

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

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/contexts/auth"

import {
  getThreadsByCourseId,
  type DiscussionThread,
  createThread,
} from "@/services/discussionsService"

import { subscribeToCourseThreads } from "@/services/websocketService"

/* ------------------------------------------------------
   New Thread Modal (Shadcn Dialog)
---------------------------------------------------------*/
function NewThreadModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (title: string, body: string) => Promise<void>
}) {
  const [title, setTitle] = React.useState("")
  const [body, setBody] = React.useState("")

  React.useEffect(() => {
    if (!open) {
      setTitle("")
      setBody("")
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Thread</DialogTitle>
          <DialogDescription>Start a new discussion.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Thread title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            placeholder="Write your thread..."
            value={body}
            rows={6}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!title.trim()} onClick={() => onSubmit(title, body)}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ------------------------------------------------------
   Delete Confirmation (Shadcn AlertDialog)
---------------------------------------------------------*/
function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}) {
  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Thread</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete “{title}”? This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/* ------------------------------------------------------
   MAIN SIDEBAR COMPONENT
---------------------------------------------------------*/

export function DiscussionSidebar({ courseId }: { courseId: string }) {
  const { user: currentUser } = useAuth()
  const { setOpen } = useSidebar()

  if (!currentUser) {
    return (
      <div className="p-4 text-muted-foreground text-sm">
        Please sign in to access discussions.
      </div>
    )
  }

  const [activeTab, setActiveTab] = React.useState("threads")
  const [threads, setThreads] = React.useState<DiscussionThread[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [newThreadModal, setNewThreadModal] = React.useState(false)

  /* Load threads */
  async function loadThreads() {
    const data = await getThreadsByCourseId(courseId)
    setThreads(data)
  }

  React.useEffect(() => {
    if (courseId) loadThreads()
  }, [courseId])

  /* Real-time thread subscription */
  React.useEffect(() => {
    if (!courseId) return
    const channel = subscribeToCourseThreads(courseId, (t) => {
      setThreads((prev) => [t, ...prev])
    })
    return () => channel.unsubscribe?.()
  }, [courseId])

  const filteredThreads = threads.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const navMenu = [
    { title: "All Threads", value: "threads", icon: MessageSquare },
    { title: "My Posts", value: "myposts", icon: User2 },
    { title: "Bookmarked", value: "bookmarks", icon: Bookmark },
  ]

  /* Create Thread Handler */
  async function handleCreateThread(title: string, body: string) {
    await createThread(courseId, currentUser.id, title, body)
    setNewThreadModal(false)
  }

  return (
    <>
      {/* New Thread Modal */}
      <NewThreadModal
        open={newThreadModal}
        onClose={() => setNewThreadModal(false)}
        onSubmit={handleCreateThread}
      />

      {/* Sidebar Layout */}
      <Sidebar collapsible="icon" className="overflow-hidden ">
        {/* ---- Left Icon Section ---- */}
        <Sidebar collapsible="none" className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r">
          <SidebarHeader className="p-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="flex flex-col items-center gap-1">
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

        {/* ---- Main Discussion Panel ---- */}
        <Sidebar collapsible="none" className="hidden flex-1 flex-col md:flex">
          <SidebarHeader className="border-b p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">
                {activeTab === "threads" && "All Threads"}
                {activeTab === "myposts" && "My Posts"}
                {activeTab === "bookmarks" && "Bookmarked"}
              </h2>

              <Button
                className="flex items-center gap-2"
                onClick={() => setNewThreadModal(true)}
              >
                <PlusCircle className="h-4 w-4" />
                New Thread
              </Button>
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

          <SidebarContent className="overflow-y-auto">
            <SidebarGroup>
              <SidebarGroupContent>
                {filteredThreads.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No threads yet. Be the first to start one!
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
                          <span className="font-medium text-sm">{thread.title}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {new Date(thread.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <span className="text-xs text-muted-foreground line-clamp-2">
                          {thread.body}
                        </span>

                        {thread.user && (
                          <div className="flex items-center gap-2 mt-1">
                            <img src={thread.user.avatar_url} className="h-5 w-5 rounded-full" />
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
    </>
  )
}
