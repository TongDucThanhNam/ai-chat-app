import { Fragment } from "react"
import type { Chat } from "@/lib/db/schema"
import { MessageSquare } from "lucide-react"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import DraggableChat from "@/components/SideBarLeft/Project/DraggableChat"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface UnassignedChatsProps {
    chats: Chat[]
}

export default function UnassignedChats({ chats }: UnassignedChatsProps) {
    return (
        <Fragment>
            <Accordion type="single" collapsible defaultValue="unassigned-chatSchema" className="">
                <AccordionItem value="unassigned-chatSchema" className="border-0">
                    <AccordionTrigger className="flex items-center gap-2 px-4 py-2 hover:no-underline">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span className="text-sm font-medium">Unassigned Chats</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="pl-6">
                            <SortableContext items={chats.map((chat) => chat.id)} strategy={verticalListSortingStrategy}>
                                {chats.map((chat) => (
                                    <DraggableChat key={chat.id} chat={chat} projectId={null} isOpen={true} />
                                ))}
                            </SortableContext>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Fragment>
    )
}