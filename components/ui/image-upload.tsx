"use client"

import * as React from "react"
import Image from "next/image"
import { UploadDropzone } from "@uploadthing/react"
import { X } from "lucide-react"
import { useCallback, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: string[]) => void
  onRemove: (value: string) => void
  value: string[]
}

export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false)

  const onUpload = useCallback(async (result: any) => {
    onChange([...value, result.info.secure_url])
  }, [onChange, value])

  const onRemoveImage = useCallback((url: string) => {
    onRemove(url)
  }, [onRemove])

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative h-[200px] w-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemoveImage(url)}
                variant="destructive"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <UploadDropzone<OurFileRouter, "productImage">
        endpoint="productImage"
        onClientUploadComplete={(res) => {
          if (res) {
            const urls = res.map((file) => file.url)
            onChange([...value, ...urls])
          }
        }}
        onUploadError={(error: Error) => {
          console.log(error)
        }}
      />
      <Button
        type="button"
        disabled={value.length >= 5}
        variant="secondary"
        onClick={() => {
          // Implement your image upload logic here
          // This could be using a file input, drag and drop, or a third-party service
          console.log("Image upload clicked")
        }}
      >
        Upload an Image
      </Button>
    </div>
  )
} 