"use client"

import type React from "react"
import { useRef, useState } from "react"
import { IconUpload } from "@tabler/icons-react"

interface DragDropZoneProps {
  onDrop: (file: File) => void
  accept?: string
}

export function DragDropZone({ onDrop, accept }: DragDropZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    setFileName(file.name)
    onDrop(file)
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <>
      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`cursor-pointer border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-muted-foreground/60"
        }`}
      >
        <IconUpload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />

        <p className="text-sm font-medium">
          Click to upload or drag & drop
        </p>

        {fileName ? (
          <p className="mt-2 text-xs text-primary truncate">
            Selected: {fileName}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">
            {accept || "MP4, PDF, PNG, JPG"}
          </p>
        )}
      </div>
    </>
  )
}
