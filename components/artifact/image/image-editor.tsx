"use client"

import type React from "react"
import { Fragment, useState, memo, useCallback } from "react"
import { imageGen } from "@/app/actions/runware"
import type { CardSettings } from "@/components/SidebarRight/ImageGen/ai-card-generation"
import { FormGeneration } from "@/components/SidebarRight/ImageGen/form-generation"
import { Preview } from "@/components/SidebarRight/ImageGen/preview-generation"
import SplashCursor from "@/components/SidebarRight/ImageGen/SplashCursor"
import { cn } from "@/lib/utils"
import { Download, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface ImageEditorProps {
  title: string
  content: string
  isCurrentVersion?: boolean
  currentVersionIndex?: number
  status?: string
  isInline?: boolean
}

// Pure component implementation
function PureImageEditor({
  title,
  content,
  status = "idle",
  isInline = false,
  isCurrentVersion = true,
  currentVersionIndex = 0,
}: ImageEditorProps) {
  console.log(`Rendering ImageEditor: ${currentVersionIndex}`) // For debugging

  const [images, setImages] = useState<string[]>([content])
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [prompt, setPrompt] = useState<string>(title)

  const [settings, setSettings] = useState<CardSettings>({
    style: "artistic",
    backgroundColor: "studio",
    lighting: "studio",
    pose: "profile",
    aspectRatio: "3:4",
  })

  // Memoize callback functions to prevent unnecessary re-renders of child components
  const setImagesCallback = useCallback((newImages: string[]) => {
    setImages(newImages)
  }, [])

  const setPromptCallback = useCallback((newPrompt: string) => {
    setPrompt(newPrompt)
  }, [])

  const setSettingsCallback = useCallback((newSettings: CardSettings) => {
    setSettings(newSettings)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setShowForm(false)
      setIsLoading(true)
      setError(null)

      try {
        const images = await imageGen({
          positivePrompt:
            prompt +
            ` in ${settings.style} style, ${settings.backgroundColor} background, ${settings.lighting} lighting, ${settings.pose} pose, ${settings.aspectRatio} aspect ratio`,
          negativePrompt: "bad weather",
          height: 1024,
          width: 768,
        })
        setImages(images.map((image) => image || ""))
      } catch (err) {
        setError("Failed to generate images. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [prompt, settings],
  )

  const toggleForm = useCallback(() => {
    setShowForm((prev) => !prev)
    setError(null)
  }, [])

  return (
    <Fragment>
      <Card
        className={cn(
          "flex flex-col w-full bg-background border-border overflow-hidden",
          isInline ? "max-h-[350px]" : "h-full",
        )}
      >
        {status === "streaming" && <SplashCursor />}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-md m-4">
            {error}
            <Button variant="outline" size="sm" className="ml-2" onClick={() => setError(null)}>
              Dismiss
            </Button>
          </div>
        )}

        {isInline ? (
          // Inline mode layout
          <div className="flex h-full">
            <div className="flex-1 p-2 flex items-center justify-center">
              <Preview
                content={content}
                isLoading={isLoading || status === "streaming"}
                imageUrl={images[0]}
                className="max-h-[200px] object-contain"
              />
            </div>
            {!showForm && (
              <div className="w-48 p-2 border-l border-border flex flex-col justify-between">
                <div className="text-xs space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Style</span>
                          <span className="font-medium">{settings.style}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Background</span>
                          <span className="font-medium">{settings.backgroundColor}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Lighting</span>
                          <span className="font-medium">{settings.lighting}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Pose</span>
                          <span className="font-medium">{settings.pose}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Aspect Ratio</span>
                          <span className="font-medium">{settings.aspectRatio}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Quality</span>
                          <span className="font-medium">1080p</span>
                        </div>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <Button size="sm" variant="outline" onClick={toggleForm}>
                    <Settings className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Full mode layout
          <>
            {showForm ? (
              // Form view
              <div className="flex flex-col h-full">
                <CardHeader className="pb-0 pt-4 px-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Edit Image Settings</CardTitle>
                    <Button variant="ghost" size="icon" onClick={toggleForm}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <FormGeneration
                    setImages={setImagesCallback}
                    onSubmit={handleSubmit}
                    settings={settings}
                    prompt={prompt}
                    setPrompt={setPromptCallback}
                    onSettingsChange={setSettingsCallback}
                  />
                </CardContent>
              </div>
            ) : (
              // Preview view
              <CardContent className="flex-1 p-0 overflow-hidden">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="flex-1 min-h-[200px] flex items-center justify-center p-4">
                    <Preview content={content} isLoading={isLoading || status === "streaming"} imageUrl={images[0]} />
                  </div>

                  <div className="w-full md:w-64 p-4 space-y-4 border-t md:border-t-0 md:border-l border-border">
                    <h3 className="font-medium text-lg">Image Details</h3>

                    <div className="space-y-4">
                      <div className="space-y-2 bg-muted/50 rounded-xl p-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Style</span>
                          <span className="font-medium">{settings.style}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Background</span>
                          <span className="font-medium">{settings.backgroundColor}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Lighting</span>
                          <span className="font-medium">{settings.lighting}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Pose</span>
                          <span className="font-medium">{settings.pose}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Aspect Ratio</span>
                          <span className="font-medium">{settings.aspectRatio}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Quality</span>
                          <span className="font-medium">1080p</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </>
        )}

        {!isInline && !showForm && (
          <CardFooter className="flex items-center justify-between gap-2 p-4 border-t">
            <Button variant="outline" onClick={toggleForm} className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Edit Settings
            </Button>

            <Button variant="default" className="w-full" disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardFooter>
        )}

        {isInline && showForm && (
          <div className="absolute inset-0 bg-background z-10">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-2 border-b">
                <h3 className="text-sm font-medium">Edit Image</h3>
                <Button variant="ghost" size="sm" onClick={toggleForm}>
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
              <div className="flex-1 overflow-auto">
                <FormGeneration
                  setImages={setImagesCallback}
                  onSubmit={handleSubmit}
                  settings={settings}
                  prompt={prompt}
                  setPrompt={setPromptCallback}
                  onSettingsChange={setSettingsCallback}
                />
              </div>
            </div>
          </div>
        )}
      </Card>
    </Fragment>
  )
}

// Custom comparison function
const arePropsEqual = (prevProps: ImageEditorProps, nextProps: ImageEditorProps): boolean => {
  // Only re-render if these critical props change
  if (prevProps.title !== nextProps.title) return false
  if (prevProps.content !== nextProps.content) return false
  if (prevProps.status !== nextProps.status) return false
  if (prevProps.isInline !== nextProps.isInline) return false

  // We can ignore isCurrentVersion and currentVersionIndex changes
  // as they don't affect the visual rendering

  return true
}

// Export the memoized component
export const ImageEditor = memo(PureImageEditor, arePropsEqual)