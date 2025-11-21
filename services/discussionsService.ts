
import { createClient } from "@/superbase/client"


export interface DiscussionThread {
  id: string
  course_id: string
  user_id: string
  title: string
  body: string
  created_at: string
  updated_at: string
  user?: {
    full_name: string
    avatar_url: string
  }
}

export interface DiscussionMessage {
  id: string
  thread_id: string
  user_id: string
  message: string
  parent_message_id?: string | null
  created_at: string
  user?: {
    full_name: string
    avatar_url: string
  }
}



const supabase = createClient()


export async function getThreadsByCourseId(courseId: string) {
  const { data, error } = await supabase
    .from("discussion_threads")
    .select(`
      *,
      user:users(full_name, avatar_url)
    `)
    .eq("course_id", courseId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as DiscussionThread[]
}


export async function getThreadById(threadId: string) {
  const { data, error } = await supabase
    .from("discussion_threads")
    .select(`
      *,
      user:users(full_name, avatar_url)
    `)
    .eq("id", threadId)
    .single()

  if (error) throw error
  return data as DiscussionThread
}


export async function createThread(courseId: string, userId: string, title: string, body: string) {
  const { data, error } = await supabase
    .from("discussion_threads")
    .insert([
      {
        course_id: courseId,
        user_id: userId,
        title,
        body,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data as DiscussionThread
}


export async function getMessagesByThread(threadId: string) {
  const { data, error } = await supabase
    .from("discussion_messages")
    .select(`
      *,
      user:users(full_name, avatar_url)
    `)
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data as DiscussionMessage[]
}


export async function createMessage(
  threadId: string,
  userId: string,
  message: string,
  parentMessageId?: string
) {
  const { data, error } = await supabase
    .from("discussion_messages")
    .insert([
      {
        thread_id: threadId,
        user_id: userId,
        message,
        parent_message_id: parentMessageId ?? null,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data as DiscussionMessage
}

export function subscribeToThreadMessages(threadId: string, onNewMessage: (msg: DiscussionMessage) => void) {
  return supabase
    .channel(`thread-${threadId}`)
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
}
