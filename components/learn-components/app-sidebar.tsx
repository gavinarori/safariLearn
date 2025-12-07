"use client"

import * as React from "react"
import { ArchiveX, Command, File, Inbox, PlusCircle, Search, Send, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth"
import {
  getThreadsByCourseId,
  type DiscussionThread,
  createThread,
} from "@/services/discussionsService"
import { subscribeToCourseThreads } from "@/services/websocketService"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
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

import { Switch } from "@/components/ui/switch"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  courseId?: any
}


// This is sample data
const data = {

  navMain: [
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      isActive: true,
    },
  ],
}

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

export function AppSidebar({ courseId, ...props }: AppSidebarProps) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])


  const [threads, setThreads] = React.useState<any[]>([])
    const [searchQuery, setSearchQuery] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const { user: currentUser }:any = useAuth()
  const [newThreadModal, setNewThreadModal] = React.useState(false)
  const { setOpen } = useSidebar()

  
    // Fetch discussion threads
  React.useEffect(() => {
    if (!courseId) return

    const load = async () => {
      setLoading(true)
      try {
        const data = await getThreadsByCourseId(courseId)
        setThreads(data)
      } catch (err) {
        console.error("Error loading discussion threads:", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [courseId])

    if (!currentUser) {
    return (
      <div className="p-4 text-muted-foreground text-sm">
        Please sign in to access discussions.
      </div>
    )
  }

  const formatTime = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleDateString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    })
  }

    const filteredThreads = threads.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  async function handleCreateThread(title: string, body: string) {
    await createThread(courseId, currentUser.id, title, body)
    setNewThreadModal(false)
  }
  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >

            <NewThreadModal
        open={newThreadModal}
        onClose={() => setNewThreadModal(false)}
        onSubmit={handleCreateThread}
      />
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="">
              Course Discussions
            </div>

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
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
                {loading && (
                <p className="text-sm p-4 opacity-70">Loading discussions...</p>
              )}

              {!loading && threads.length === 0 && (
                <p className="text-sm p-4 opacity-70">No discussions yet.</p>
              )}

              {threads.map((thread) => (
                <button
                  key={thread.id}
                  className="
                    hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                    flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight
                    text-left w-full
                  "
                >
                  <div className="flex w-full items-center gap-2">
                    <span>{thread.user?.full_name || "Anonymous"}</span>
                    <span className="ml-auto text-xs">
                      {formatTime(thread.created_at)}
                    </span>
                  </div>

                  <span className="font-medium">{thread.title}</span>

                  <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces opacity-80">
                    {thread.body}
                  </span>
                </button>
              ))}

            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
