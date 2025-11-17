"use client"

import { createClient } from "@/superbase/client"

const supabase = createClient()

export interface CalendarEvent {
  id?: string
  created_at?: string
  course_id: string
  user_id: string
  title: string
  description?: string
  start_time: string
  end_time?: string
  updated_at?: string
}

export async function createCalendarEvent(eventData: CalendarEvent) {
  const { data, error } = await supabase
    .from("course_events")
    .insert(eventData)
    .select()
    .single()

  if (error) throw error
  return data as CalendarEvent
}


export async function getUserCourseCalendar(courseId: string, userId: string) {
  const { data, error } = await supabase
    .from("course_events")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .order("start_time", { ascending: true })

  if (error) throw error
  return data as CalendarEvent[]
}


export async function getCourseCalendar(courseId: string) {
  const { data, error } = await supabase
    .from("course_events")
    .select("*")
    .eq("course_id", courseId)
    .order("start_time", { ascending: true })

  if (error) throw error
  return data as CalendarEvent[]
}


export async function updateCalendarEvent(
  id: string,
  updates: Partial<CalendarEvent>
) {
  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("course_events")
    .update(payload)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as CalendarEvent
}


export async function deleteCalendarEvent(id: string) {
  const { error } = await supabase
    .from("course_events")
    .delete()
    .eq("id", id)

  if (error) throw error
  return true
}


export async function getFullCalendarForUser(courseId: string, userId: string) {
  const { data, error } = await supabase
    .from("course_events")
    .select("*")
    .eq("course_id", courseId)
    .order("start_time", { ascending: true })

  if (error) throw error

  // User sees:
  // - their own plan
  // - trainer events
  return data as CalendarEvent[]
}
