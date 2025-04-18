import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ChatTopbarProps {
  // Define any props if needed
  title?: string;
}

export default function ChatTopbar({ title }: ChatTopbarProps) {
  return (
    <div className="flex items-center justify-between px-4 h-12 border-b">
      <div className="text-sm font-medium">chatGPT</div>
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          Try else model
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Ellipsis className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>New Chat</DropdownMenuItem>
            <DropdownMenuItem>Clear History</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mr-2 h-4" />

        {/* <SidebarTrigger/> */}
      </div>
    </div>
  );
}
