"use client";

import { Fragment, useState } from "react";
import { MessageSquare, Plus } from "lucide-react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { assignChatToProject, createNewChat } from "@/app/actions/chats";
import { createNewProject } from "@/app/actions/projects";
import { useRouter } from "next/navigation";
import { Chat, Project } from "@/lib/db/schema";
import DroppableProjectHeader from "@/components/SideBarLeft/Project/DroppableProjectHeader";
import DroppableProjectContent from "@/components/SideBarLeft/Project/DroppableProjectContent";
import UnassignedChats from "@/components/SideBarLeft/Project/UnassignedChats";
import { mutate } from "swr";

interface ProjectSidebarProps {
  projects: Project[];
  unassignedChats: Chat[];
}

export default function ProjectSidebar({
  projects = [],
  unassignedChats = [],
}: ProjectSidebarProps) {
  // Track which accordion items are open
  const [openProjects, setOpenProjects] = useState<string[]>(
    projects.length > 0 ? [projects[0].id] : [],
  );

  // Add a state to track the currently dragged item
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Track which project headers are being hovered over during drag
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const router = useRouter();

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Add a function to handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    setActiveId(active.id as string);

    if (activeData?.type === "chat") {
      setActiveChat(activeData.chat);
      setActiveProjectId(activeData.projectId);
    }
  };

  // Handle drag over event to detect when hovering over project headers
  const handleDragOver = (event: any) => {
    const { over } = event;

    if (over) {
      const overData = over.data.current;

      if (overData?.type === "projectHeader") {
        setHoveredProjectId(overData.projectId);
      } else {
        setHoveredProjectId(null);
      }
    } else {
      setHoveredProjectId(null);
    }
  };

  // Handle drag end event
  const handleDragEnd = async (event: DragEndEvent) => {
    console.log("Drag end event");

    const { active, over } = event;

    // Reset active states
    setActiveId(null);
    setActiveChat(null);
    setActiveProjectId(null);
    setHoveredProjectId(null);

    if (!over) return;

    // Get data from the dragged item
    const activeData = active.data.current;
    const overId = over.id;
    const overData = over.data.current;

    if (activeData?.type === "chat") {
      const draggedChatId = active.id as string;
      const sourceProjectId = activeData.projectId;

      // Find the target project (the one being hovered over)
      let targetProjectId: string | null = sourceProjectId;

      // Check if we're dropping over a droppable project area
      if (typeof overId === "string" && overId.startsWith("droppable-")) {
        targetProjectId = overId.replace("droppable-", "");
      }
      // Check if we're dropping over a project header
      else if (typeof overId === "string" && overId.startsWith("header-")) {
        targetProjectId = overId.replace("header-", "");
      }
      // Check if we're dropping over another chat
      // else if (typeof overId === "string" && overId !== draggedChatId) {
      //     // Find which project contains the target chat
      //     for (const project of projectSchema) {
      //         if (project.chatSchema.some((chat) => chat.id === overId)) {
      //             targetProjectId = project.id
      //             break
      //         }
      //     }
      // }

      // If we're moving to a different project
      if (sourceProjectId !== targetProjectId) {
        // Update the chat's project in the database
        await assignChatToProject(draggedChatId, targetProjectId);

        // Make sure the target project accordion is open
        if (targetProjectId && !openProjects.includes(targetProjectId)) {
          setOpenProjects((prev) => [...prev, targetProjectId!]);
        }

        // Refresh the page to reflect the changes
        router.refresh();
      }
    }
  };

  // Handle accordion state changes
  const handleAccordionChange = (value: string[]) => {
    setOpenProjects(value);
  };

  const handleNewProject = async () => {
    await createNewProject("New Project");
    mutate("/api/project");
    // router.refresh();
  };

  const handleNewChat = async () => {
    const chat = await createNewChat("New Chat");
    router.push(`/chat/${chat.id}`);
    mutate("/api/project");
  };

  return (
    <Fragment>
      <DndContext
        id={"sidebar"} // TODO: add a unique id for the sidebar
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="flex-1 overflow-auto">
          <div className="p-2">
            <div className="flex mb-4">
              <div className="w-full flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 justify-start gap-2 rounded-md"
                  onClick={handleNewProject}
                >
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 justify-start gap-2 rounded-md"
                  onClick={handleNewChat}
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </div>
            </div>

            {/*Unassigned chat*/}
            {unassignedChats.length > 0 && (
              <UnassignedChats chats={unassignedChats} />
            )}

            {/* Projects*/}
            <Accordion
              type="multiple"
              className="w-full"
              value={openProjects}
              onValueChange={handleAccordionChange}
            >
              {projects.map((project) => (
                <AccordionItem
                  value={project.id}
                  key={project.id}
                  className="border-none"
                  data-project-id={project.id}
                >
                  <AccordionTrigger
                    className={`flex items-center py-2 px-4 w-full hover:bg-accent hover:text-accent-foreground rounded-md [&[data-state=open]>svg]:rotate-180 ${
                      hoveredProjectId === project.id
                        ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
                        : ""
                    }`}
                  >
                    <DroppableProjectHeader
                      project={project}
                      isActive={
                        activeId !== null && activeProjectId !== project.id
                      }
                    />
                  </AccordionTrigger>
                  <DroppableProjectContent
                    project={project}
                    openProjects={openProjects}
                  />
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        <DragOverlay
          adjustScale={false}
          dropAnimation={{
            duration: 300,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          {activeId && activeChat ? (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-8 px-4 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-400 dark:border-blue-600 shadow-lg"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">{activeChat.title}</span>
            </Button>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Fragment>
  );
}
