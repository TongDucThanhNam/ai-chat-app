// Draggable Chat Component
import {CSS} from "@dnd-kit/utilities";
import {Chat} from "@/lib/db/schema";
import {useSortable} from "@dnd-kit/sortable";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {MessageSquare} from "lucide-react";
import {cn} from "@/lib/utils";

interface DraggableChatProps {
    chat: Chat;
    projectId: string | null;
    isOpen: boolean;
}

export default function DraggableChat({chat, projectId, isOpen}: DraggableChatProps) {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: chat.id,
        data: {
            type: "chat",
            chat,
            projectId,
        },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 1 : 0,
    }

    const router = useRouter()

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="touch-manipulation transition-all duration-200"
        >
            <Button
                variant="ghost"
                className={cn(
                    "w-full justify-start gap-2 h-8 px-4 cursor-grab active:cursor-grabbing",
                    isDragging ? "bg-accent/50" : "hover:bg-accent/80",
                    isOpen ? "bg-accent/50" : "bg-transparent",
                )}
                onClick={() => router.push(`/chat/${chat.id}`)}
            >
                <MessageSquare className="h-4 w-4"/>
                <span className="text-sm">{chat.title}</span>
            </Button>
        </div>
    )
}