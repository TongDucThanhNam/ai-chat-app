"use client";

import { Button } from "../ui/button";
import {
  BookMarked,
  FileText,
  HelpCircle,
  PanelLeft,
  Search,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import ProjectSidebar from "@/components/SideBarLeft/Project/ProjectSidebar";
import SignIn from "@/components/SideBarLeft/sign-in";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { fetcher } from "@/lib/utils";
import { User } from "@/lib/db/schema/authSchema";
import useSWR from "swr";
import { Skeleton } from "../ui/skeleton";
import { memo } from "react";
import EmptyProjectsState from "./Project/EmptyProjectsState";

interface SidebarLeftProps {
  user?: User;
}

const SidebarLeft = memo(({ user }: SidebarLeftProps) => {
  const { data, isLoading } = useSWR<any>(
    user ? "/api/project" : null,
    fetcher,
    {
      fallbackData: { projects: [], unassignedChat: [] },
    },
  );

  return (
    <div className="max-h-screen w-80 border-r flex flex-col">
      <div className="p-2 border-b">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="font-medium">Mycelium AI</div>
          <div className="flex items-center gap-1 ml-auto">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <BookMarked className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <PanelLeft className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sidebar Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center justify-center">
                  <PremiumBadge />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : user ? (
          <ProjectSidebar
            projects={data?.projects || []}
            unassignedChats={data?.unassignedChat || []}
          />
        ) : (
          <EmptyProjectsState />
        )}
      </div>
      <div className="border-t p-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          {user ? (
            <Link href={`/dashboard`}>
              <Avatar>
                <AvatarImage src={user.image as string} alt="@shadcn" />
                <AvatarFallback>NT</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <SignIn />
          )}
        </div>
      </div>
    </div>
  );
});

SidebarLeft.displayName = "SidebarLeft";
export default SidebarLeft;
