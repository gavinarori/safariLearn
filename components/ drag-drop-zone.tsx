"use client"

import type React from "react"

import { useState } from "react"
import { IconUpload } from "@tabler/icons-react"

interface DragDropZoneProps {
  onDrop: (file: File) => void
}

export function DragDropZone({ onDrop }: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

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

    const files = e.dataTransfer.files
    if (files.length > 0) {
      onDrop(files[0])
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
      }`}
    >
      <IconUpload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
      <p className="text-sm font-medium">Drag files here or click to upload</p>
      <p className="text-xs text-muted-foreground mt-1">Supports MP4, PDF, PNG, JPG</p>
    </div>
  )
}
