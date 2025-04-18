"use client";

import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, FolderClosed } from "lucide-react";
import { authClient, signIn } from "@/lib/auth-client"; // import the auth client

interface EmptyProjectsStateProps {}

export default function EmptyProjectsState({}: EmptyProjectsStateProps) {
  return (
    <Fragment>
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Illustration */}
          <div className="relative">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
              <FolderClosed className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
              <LogIn className="h-3 w-3 text-primary-foreground" />
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-2">
            <h3 className="font-semibold tracking-tight">No projects found</h3>
            <p className="text-sm text-muted-foreground max-w-[20rem]">
              Sign in to access your projects and chat history
            </p>
          </div>

          {/* Action button */}
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() =>
              signIn.social({
                provider: "google",
                callbackURL: "/",
              })
            }
          >
            <LogIn className="mr-2 h-3.5 w-3.5" />
            Sign in with Google
          </Button>
        </div>
      </div>
    </Fragment>
  );
}
