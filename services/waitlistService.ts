"use client"

import { createClient } from "@/superbase/client"

const supabase = createClient()

export interface WaitlistEntry {
  id?: string
  full_name: string
  email: string
  role: string
  Suggestions?: any
   Suggestion?: any
  created_at?: string
}


export async function addToWaitlist(entry: WaitlistEntry) {
  const { data, error } = await supabase
    .from("Wait_list")
    .insert({
      full_name: entry.full_name,
      email: entry.email,
      role: entry.role,
      Suggestions: entry.Suggestions ?? null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}


export async function getWaitlist() {
  const { data, error } = await supabase
    .from("Wait_list")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data
}


export async function checkWaitlistByEmail(email: string) {
  const { data, error } = await supabase
    .from("Wait_list")
    .select("*")
    .eq("email", email)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}
