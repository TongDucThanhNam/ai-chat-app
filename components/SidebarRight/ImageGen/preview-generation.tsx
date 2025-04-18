"use client";

import { memo, useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PreviewProps {
  isLoading: boolean;
  imageUrl?: string;
  content?: string;
  className?: string;
  alt?: string;
}

// Pure component implementation
function PurePreview({
  isLoading,
  imageUrl,
  content,
  className,
  alt = "Generated image",
}: PreviewProps) {
  console.log("Rendering Preview"); // For debugging

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [imageError, setImageError] = useState(false);

  const loadingTexts = [
    "Creating your masterpiece...",
    "Finding the perfect colors...",
    "Adding the final touches...",
    "Enhancing details...",
    "Applying artistic style...",
  ];

  // Reset states when loading state changes
  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      setCurrentTextIndex(0);
      setImageError(false);

      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          // Slow down as we approach 100%
          const increment = prev < 70 ? 1 : prev < 90 ? 0.5 : 0.2;
          const newValue = prev + increment;

          if (newValue >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newValue;
        });
      }, 50);

      // Text rotation
      const textInterval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 2000);

      return () => {
        clearInterval(progressInterval);
        clearInterval(textInterval);
      };
    }
  }, [isLoading, loadingTexts.length]);

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Determine which image source to use
  const imageSrc = imageUrl || content;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      {isLoading ? (
        <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <div className="relative w-12 h-12">
              <Loader2 className="w-full h-full animate-spin text-primary" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/10 rounded-full animate-pulse" />
            </div>

            <div className="space-y-1 text-center">
              <p className="text-sm font-medium" aria-live="polite">
                {loadingTexts[currentTextIndex]}
              </p>
              <p className="text-xs text-muted-foreground">
                This usually takes 10-15 seconds
              </p>
            </div>

            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </CardContent>
        </Card>
      ) : imageError ? (
        <div className="flex flex-col items-center justify-center p-6 text-center bg-muted/50 rounded-xl w-full h-full min-h-[200px]">
          <p className="text-sm font-medium text-muted-foreground">
            Unable to load image
          </p>
        </div>
      ) : imageSrc ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={alt}
            className="max-w-full max-h-full object-contain"
            // onError={handleImageError}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center p-6 text-center bg-muted/50 rounded-xl w-full h-full min-h-[200px]">
          <p className="text-sm font-medium text-muted-foreground">
            No image available
          </p>
        </div>
      )}
    </div>
  );
}

// Custom comparison function
const arePropsEqual = (
  prevProps: PreviewProps,
  nextProps: PreviewProps,
): boolean => {
  // Check if loading state changed
  if (prevProps.isLoading !== nextProps.isLoading) return false;

  // If not loading, check if image source changed
  if (!nextProps.isLoading) {
    if (prevProps.imageUrl !== nextProps.imageUrl) return false;
    if (prevProps.content !== nextProps.content) return false;
  }

  // Check if className changed (affects styling)
  if (prevProps.className !== nextProps.className) return false;

  // Alt text changes don't require re-render unless for accessibility reasons
  // if (prevProps.alt !== nextProps.alt) return false

  return true;
};

// Export the memoized component
export const Preview = memo(PurePreview, arePropsEqual);
