"use client"

import React, { useState } from "react"
import { MessageCircle, Keyboard, Send, Pencil } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  getMessagesByThread,
  createMessage,
  updateMessage,
} from "@/services/discussionsService"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import type { DiscussionMessage } from "@/services/discussionsService"
import { useAuth } from "@/contexts/auth"

export function MessageNotesDialog({ open, onOpenChange, thread }: any) {
  const { user }:any = useAuth()

  const [messages, setMessages] = React.useState<DiscussionMessage[]>([])
  const [notes, setNotes] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [newMessage, setNewMessage] = React.useState("")
  const [activeTab, setActiveTab] = useState("messages")
  const [isSavingMessage, setIsSavingMessage] = React.useState(false)

  // Editing state
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editingText, setEditingText] = React.useState("")

  // Load messages
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

  // Send new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsSavingMessage(true)
    try {
      const saved = await createMessage(thread.id, user.id, newMessage)
      setMessages((prev) => [...prev, saved])
      setNewMessage("")
    } catch (e) {
      console.error("Failed to send message:", e)
    } finally {
      setIsSavingMessage(false)
    }
  }

  // Save edited message
  const handleSaveEdit = async () => {
    if (!editingText.trim() || !editingId) return

    try {
      const updated = await updateMessage(editingId, user.id, editingText)
      setMessages((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, message: editingText } : m))
      )
      setEditingId(null)
      setEditingText("")
    } catch (e) {
      console.error("Failed to update message:", e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 h-[600px] md:max-w-[800px] flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          {/* HEADER */}
          <div className="border-b bg-background px-6 py-4 space-y-3 flex-shrink-0">
            <h2 className="text-lg font-semibold leading-tight">{thread?.title}</h2>
            <p className="text-sm text-muted-foreground">{thread?.body}</p>

            <TabsList className="grid w-full grid-cols-2 gap-1 bg-transparent">
              <TabsTrigger value="messages">Discussion</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
          </div>

          {/* MESSAGES TAB */}
          <TabsContent value="messages" className="flex flex-col h-full overflow-hidden">
            <ScrollArea className="flex-1 h-full overflow-y-auto">
              <div className="p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="group flex gap-3 rounded-lg border border-border/50 bg-card/40 p-4 hover:bg-card/70 transition-colors"
                  >
                    {/* Avatar */}
                    <Avatar className="h-10 w-10">
                      {msg.user?.avatar_url ? (
                        <AvatarImage src={msg.user.avatar_url} />
                      ) : (
                        <AvatarFallback>
                          {msg.user?.full_name
                            ? msg.user.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    {/* Message content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{msg.user?.full_name}</span>

                        {/* Edit button */}
                        {msg.user_id === user.id && (
                          <button
                            className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
                            onClick={() => {
                              setEditingId(msg.id)
                              setEditingText(msg.message)
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                            Edit
                          </button>
                        )}
                      </div>

                      {/* Editing mode */}
                      {editingId === msg.id ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full p-2 border rounded"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit}>
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(null)
                                setEditingText("")
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="border-t bg-background/80 backdrop-blur-sm p-4 flex-shrink-0">
              <div className="flex gap-2 items-end">
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border p-2 rounded"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* NOTES TAB */}
          <TabsContent value="notes" className="flex flex-1 flex-col overflow-hidden gap-0">
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="mb-4 flex items-center justify-between">
                <label htmlFor="notes" className="text-sm font-semibold text-foreground">
                  Thread Notes
                </label>
                <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-1 rounded">
                  {notes.length} characters
                </span>
              </div>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your notes here...

• Key decisions made
• Action items
• Ideas to explore
• Questions to follow up on"
                className="flex-1 resize-none rounded-lg border border-input bg-background p-4 text-sm font-mono leading-relaxed placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all"
              />
            </div>
            <div className="border-t bg-background/80 backdrop-blur-sm p-4 flex gap-2 justify-end flex-shrink-0">
              <Button variant="outline" size="sm" onClick={() => setNotes("")}>
                Clear Notes
              </Button>
              <Button size="sm">Save Notes</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
