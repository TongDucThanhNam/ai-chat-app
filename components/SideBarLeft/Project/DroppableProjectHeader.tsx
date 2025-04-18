// Droppable Project Header
import {useDroppable} from "@dnd-kit/core";
import {Project} from "@/lib/db/schema";
import {ArrowDown, Folder} from "lucide-react";

export default function DroppableProjectHeader({ project, isActive }: { project: Project; isActive: boolean }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `header-${project.id}`,
        data: {
            type: "projectHeader",
            projectId: project.id,
        },
    })

    return (
        <div
            ref={setNodeRef}
            className={`flex items-center gap-2 flex-1 transition-colors duration-200 ${
                isOver ? "text-blue-600 dark:text-blue-400 font-medium" : ""
            }`}
        >
            <Folder className={`h-4 w-4 ${isOver ? "text-blue-600 dark:text-blue-400 animate-pulse" : ""}`} />
            <span className="text-sm">{project.name}</span>
            {isOver && (
                <div className="flex items-center ml-2 text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-medium animate-pulse">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    Drop here
                </div>
            )}
        </div>
    )
}