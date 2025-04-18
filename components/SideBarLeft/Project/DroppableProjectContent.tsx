"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Project } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { createNewChat, getChatsByProjectId } from "@/app/actions/chats";
import { AccordionContent } from "@/components/ui/accordion";
import { ArrowDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableChat from "@/components/SideBarLeft/Project/DraggableChat";
import useSWR, { mutate } from "swr";
import { Skeleton } from "@/components/ui/skeleton";

export default function DroppableProjectContent({
  project,
  openProjects,
}: {
  project: Project;
  openProjects: string[];
}) {
  //Fetch chat from project
  const { data, error, isLoading } = useSWR(
    `${project.id}`,
    getChatsByProjectId,
  );

  const isOpen = openProjects.includes(project.id);

  // console.log("isOpen", isOpen)

  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${project.id}`,
    data: {
      type: "project",
      projectId: project.id,
    },
  });

  const router = useRouter();

  const handleNewChat = async () => {
    const chat = await createNewChat(`New Chat in ${project.name}`, project.id);
    mutate(`${project.id}`);
    // Redirect to the new chat page
    router.push(`/chat/${chat.id}`);
  };

  // Loading skeleton UI
  if (isLoading) {
    return (
      <AccordionContent>
        <div className="pl-6 py-1">
          {/* Skeleton for New Chat button */}
          <Skeleton className="h-9 w-full mb-1 rounded-md" />

          {/* Skeletons for chat items */}
          {Array.from({ length: 1 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          ))}
        </div>
      </AccordionContent>
    );
  }

  if (error)
    return (
      <AccordionContent>
        <div className="pl-6 py-1 text-red-500 text-sm">
          Failed to load chats
        </div>
      </AccordionContent>
    );

  return (
    <AccordionContent>
      <div
        ref={setNodeRef}
        className={`pl-6 py-1 rounded-md transition-colors duration-200 ${
          isOver
            ? "bg-blue-200 dark:bg-blue-800/50 shadow-inner drop-target-pulse"
            : ""
        }`}
      >
        {isOver && (
          <div className="flex items-center justify-center py-2 text-blue-600 dark:text-blue-400 font-medium text-sm">
            <ArrowDown className="h-4 w-4 mr-2 animate-bounce" />
            Drop here
          </div>
        )}

        {/* add new Chat */}
        <Button
          variant="outline"
          className="w-full flex-1 justify-start gap-2 mb-1"
          onClick={handleNewChat}
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>

        {/* Chats */}
        {data && data.length > 0 && (
          <SortableContext
            items={data.map((chat) => chat.id)}
            strategy={verticalListSortingStrategy}
          >
            {data.map((chat) => (
              <DraggableChat
                key={chat.id}
                chat={chat}
                projectId={project.id}
                isOpen={isOpen}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </AccordionContent>
  );
}
