"use client"

import * as React from "react"
import Image from "next/image"

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState(0)

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-4 md:flex-col">
        {images.map((image, index) => (
          <button
            key={image}
            className={`relative aspect-square h-20 overflow-hidden rounded-lg border-2 transition-colors ${
              selectedImage === index
                ? "border-primary"
                : "border-transparent hover:border-muted"
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image}
              alt={`${name} thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-lg bg-muted">
        <Image
          src={images[selectedImage]}
          alt={`${name} image ${selectedImage + 1}`}
          fill
          className="object-cover"
          priority={selectedImage === 0}
        />
      </div>
    </div>
  )
} 