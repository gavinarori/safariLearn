import { createClient } from "@/superbase/client"

const supabase = createClient()

export const uploadFileToStorage = async ({
  bucket,
  path,
  file,
}: {
  bucket: string
  path: string
  file: File
}) => {
  if (!file) throw new Error("No file provided")

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    })

  if (error) {
    console.error("Upload failed:", error)
    throw error
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  return data.publicUrl
}
