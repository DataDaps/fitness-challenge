'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

interface ImageUploadProps {
  label: string
  onImageUpload: (file: File) => void
}

export default function ImageUpload({ label, onImageUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setPreview(dataUrl)
      onImageUpload(file)
    }

    reader.readAsDataURL(file)
  }, [onImageUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  })

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-accent">{label}</h3>
      <div
        {...getRootProps()}
        className={`glass-effect relative rounded-xl p-4 text-center cursor-pointer transition-all ${
          isDragActive ? 'border-accent' : 'border-white/10'
        } border-2 border-dashed min-h-[200px] flex items-center justify-center`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt={`${label} preview`} className="max-h-48 rounded-lg" />
        ) : (
          <div className="space-y-4">
            <Upload className="w-8 h-8 mx-auto text-accent" />
            <p className="text-sm text-muted-foreground">
              {isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

