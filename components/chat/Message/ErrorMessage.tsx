"use client"

import { Fragment } from "react"
import { AlertCircle, RefreshCw, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorMessageProps {
    error: Error
    onRetry?: () => void
    onDismiss?: () => void
}

export default function ErrorMessage({ error, onRetry, onDismiss }: ErrorMessageProps) {
    // Determine error type and customize message
    const errorType = getErrorType(error)

    return (
        <Fragment>
            <Alert
                variant="destructive"
                className="border-red-300 bg-red-50 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-200"
            >
                <AlertCircle className="h-4 w-4" />
                <div className="flex-1">
                    <AlertTitle className="font-medium">{errorType.title}</AlertTitle>
                    <AlertDescription className="text-sm text-red-800 dark:text-red-300">
                        {error.message || errorType.defaultMessage}
                    </AlertDescription>
                </div>
            </Alert>

            {(onRetry || onDismiss) && (
                <div className="flex gap-2 mt-2 justify-end">
                    {onRetry && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRetry}
                            className="text-xs h-8 border-red-300 hover:bg-red-100 hover:text-red-900 dark:border-red-800 dark:hover:bg-red-900"
                        >
                            <RefreshCw className="mr-1 h-3 w-3" />
                            Try again
                        </Button>
                    )}
                    {onDismiss && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDismiss}
                            className="text-xs h-8 text-red-700 hover:bg-red-100 hover:text-red-900 dark:text-red-300 dark:hover:bg-red-900"
                        >
                            <XCircle className="mr-1 h-3 w-3" />
                            Dismiss
                        </Button>
                    )}
                </div>
            )}
        </Fragment>
    )
}

// Helper function to categorize errors and provide appropriate messageSchema
function getErrorType(error: Error): { title: string; defaultMessage: string } {
    // Check for network errors
    if (error.message.includes("network") || error.message.includes("connection") || error.message.includes("offline")) {
        return {
            title: "Network Error",
            defaultMessage: "Unable to connect to the AI service. Please check your internet connection.",
        }
    }

    // Check for timeout errors
    if (error.message.includes("timeout") || error.message.includes("timed out")) {
        return {
            title: "Request Timeout",
            defaultMessage: "The AI service took too long to respond. Please try again.",
        }
    }

    // Check for API rate limit errors
    if (error.message.includes("rate limit") || error.message.includes("too many requests")) {
        return {
            title: "Rate Limit Exceeded",
            defaultMessage: "You've reached the maximum number of requests. Please try again later.",
        }
    }

    // Default error
    return {
        title: "AI Response Error",
        defaultMessage: "Something went wrong with the AI response. Please try again.",
    }
}

