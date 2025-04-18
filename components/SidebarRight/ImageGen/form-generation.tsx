"use client"

import type React from "react"
import { memo } from "react"
import { MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface CardSettings {
  style: string
  backgroundColor: string
  lighting: string
  pose: string
  aspectRatio: string
}

interface FormGenerationProps {
  setImages: (images: string[]) => void
  onSubmit: (e: React.FormEvent) => void
  settings: CardSettings
  onSettingsChange: (settings: CardSettings) => void
  prompt: string
  setPrompt: (prompt: string) => void
}

// Pure component implementation
function PureFormGeneration({ onSubmit, settings, onSettingsChange, prompt, setPrompt }: FormGenerationProps) {
  console.log("Rendering FormGeneration") // For debugging

  const updateSetting = (key: keyof CardSettings, value: string) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 h-full p-4">
      <div className="space-y-2">
        <Label htmlFor="prompt" className="flex items-center gap-2 text-sm font-medium">
          <MessageCircle className="w-4 h-4" />
          Prompt
        </Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to create..."
          className="min-h-[80px] resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="style" className="text-sm font-medium">
            Style
          </Label>
          <Select value={settings.style} onValueChange={(value) => updateSetting("style", value)}>
            <SelectTrigger id="style">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="artistic">Artistic</SelectItem>
              <SelectItem value="realistic">Realistic</SelectItem>
              <SelectItem value="cartoon">Cartoon</SelectItem>
              <SelectItem value="abstract">Abstract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="background" className="text-sm font-medium">
            Background
          </Label>
          <Select value={settings.backgroundColor} onValueChange={(value) => updateSetting("backgroundColor", value)}>
            <SelectTrigger id="background">
              <SelectValue placeholder="Select background" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="natural">Natural</SelectItem>
              <SelectItem value="gradient">Gradient</SelectItem>
              <SelectItem value="solid">Solid Color</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lighting" className="text-sm font-medium">
            Lighting
          </Label>
          <Select value={settings.lighting} onValueChange={(value) => updateSetting("lighting", value)}>
            <SelectTrigger id="lighting">
              <SelectValue placeholder="Select lighting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="natural">Natural</SelectItem>
              <SelectItem value="dramatic">Dramatic</SelectItem>
              <SelectItem value="soft">Soft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pose" className="text-sm font-medium">
            Pose
          </Label>
          <Select value={settings.pose} onValueChange={(value) => updateSetting("pose", value)}>
            <SelectTrigger id="pose">
              <SelectValue placeholder="Select pose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profile">Profile</SelectItem>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="full-body">Full Body</SelectItem>
              <SelectItem value="action">Action</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aspectRatio" className="text-sm font-medium">
            Aspect Ratio
          </Label>
          <Select value={settings.aspectRatio} onValueChange={(value) => updateSetting("aspectRatio", value)}>
            <SelectTrigger id="aspectRatio">
              <SelectValue placeholder="Select aspect ratio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1:1">Square (1:1)</SelectItem>
              <SelectItem value="4:3">Standard (4:3)</SelectItem>
              <SelectItem value="3:4">Portrait (3:4)</SelectItem>
              <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quality" className="text-sm font-medium">
            Quality
          </Label>
          <Select defaultValue="1080p">
            <SelectTrigger id="quality">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="720p">720p</SelectItem>
              <SelectItem value="1080p">1080p</SelectItem>
              <SelectItem value="2k">2K</SelectItem>
              <SelectItem value="4k">4K</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Button type="submit" className="w-full">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Image
        </Button>
      </div>
    </form>
  )
}

// Custom comparison function
const arePropsEqual = (prevProps: FormGenerationProps, nextProps: FormGenerationProps): boolean => {
  // Check if prompt changed
  if (prevProps.prompt !== nextProps.prompt) return false

  // Deep comparison for settings object
  if (prevProps.settings.style !== nextProps.settings.style) return false
  if (prevProps.settings.backgroundColor !== nextProps.settings.backgroundColor) return false
  if (prevProps.settings.lighting !== nextProps.settings.lighting) return false
  if (prevProps.settings.pose !== nextProps.settings.pose) return false
  if (prevProps.settings.aspectRatio !== nextProps.settings.aspectRatio) return false

  // We assume the callback functions don't change between renders
  // If they do change frequently, they should be memoized in the parent component

  return true
}

// Export the memoized component
export const FormGeneration = memo(PureFormGeneration, arePropsEqual)