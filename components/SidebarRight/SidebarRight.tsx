import * as React from "react"
import {BotMessageSquare, CodeXml, FileImage, FileText, Lock, Mail, User} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../ui/tooltip"
import AICardGeneration from "./ImageGen/ai-card-generation"

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    calendars: [
        {
            name: "My Calendars",
            items: ["Personal", "Work", "Family"],
        },
        {
            name: "Favorites",
            items: ["Holidays", "Birthdays"],
        },
        {
            name: "Other",
            items: ["Travel", "Reminders", "Deadlines"],
        },
    ],
}

export function SidebarRight({
                                 ...props
                             }: React.ComponentProps<typeof Sidebar>) {


    return (
        <Sidebar
            className={""}
            side={"right"}
            variant={"inset"}
            collapsible="offcanvas"
            {...props}
        >
            <SidebarHeader className="h-16 border-b border-sidebar-border">
                Tools
            </SidebarHeader>
            <SidebarContent>
                <SidebarSeparator className="mx-0"/>
                {/* Select toolSchema */}
                <div
                    className="flex items-center justify-center"
                >
                    <Tabs defaultValue="tab-1" className="w-full h-full">
                        <TabsList className="flex w-full justify-around">
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                            <span>
                                <TabsTrigger value="tab-1" className="py-3">
                                <BotMessageSquare size={16} strokeWidth={2} aria-hidden="true"/>
                                </TabsTrigger>
                            </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="px-2 py-1 text-xs">Overview</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                            <span>
                                <TabsTrigger value="tab-2" className="group py-3">
                                <span className="relative">
                                    <FileImage size={16} strokeWidth={2} aria-hidden="true"/>
                                </span>
                                </TabsTrigger>
                            </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="px-2 py-1 text-xs">Projects</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                            <span>
                                <TabsTrigger value="tab-3" className="py-3">
                                <CodeXml size={16} strokeWidth={2} aria-hidden="true"/>
                                </TabsTrigger>
                            </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="px-2 py-1 text-xs">Packages</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TabsList>
                        <TabsContent value="tab-1">
                            <p className="p-4 text-center text-xs text-muted-foreground">Chat Advanced</p>
                        </TabsContent>
                        <TabsContent value="tab-2">
                            <AICardGeneration/>
                        </TabsContent>
                        <TabsContent value="tab-3">
                            <p className="p-4 text-center text-xs text-muted-foreground">Code</p>
                        </TabsContent>
                    </Tabs>
                </div>


            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>

                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}