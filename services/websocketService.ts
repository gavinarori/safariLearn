
import { createClient } from "@/superbase/client"
import type { DiscussionMessage, DiscussionThread } from "./discussionsService"

const supabase = createClient()


export function subscribeToCourseThreads(
  courseId: string,
  onNewThread: (thread: DiscussionThread) => void
) {
  const channel = supabase
    .channel(`course-threads-${courseId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "discussion_threads",
        filter: `course_id=eq.${courseId}`,
      },
      (payload) => {
        onNewThread(payload.new as DiscussionThread)
      }
    )
    .subscribe()

  return channel
}


export function subscribeToThreadMessages(
  threadId: string,
  onNewMessage: (msg: DiscussionMessage) => void
) {
  const channel = supabase
    .channel(`thread-messages-${threadId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "discussion_messages",
        filter: `thread_id=eq.${threadId}`,
      },
      (payload) => {
        onNewMessage(payload.new as DiscussionMessage)
      }
    )
    .subscribe()

  return channel
}


export function subscribeToMessageUpdates(
  threadId: string,
  onUpdate: (msg: DiscussionMessage) => void
) {
  const channel = supabase
    .channel(`thread-updates-${threadId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "discussion_messages",
        filter: `thread_id=eq.${threadId}`,
      },
      (payload) => {
        onUpdate(payload.new as DiscussionMessage)
      }
    )
    .subscribe()

  return channel
}


export function unsubscribe(channel: any) {
  try {
    channel.unsubscribe()
  } catch {}
}
