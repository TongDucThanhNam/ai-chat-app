import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

interface InstructionsViewProps {
  content: string;
  onEdit?: () => void;
}

export default function InstructionsView({
  content,
  onEdit,
}: InstructionsViewProps) {
  return (
    <div
      className="h-[600px] w-[900px] relative hover:bg-accent/50 p-3 overflow-y-scroll"
      onClick={onEdit}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onEdit?.()}
      aria-label="Edit instructions"
    >
      <p className="text-sm whitespace-pre-wrap pr-8">{content}</p>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute right-2 top-2 opacity-0 group-hover/edit:opacity-100 transition-opacity",
          "h-6 w-6",
        )}
        aria-label="Edit message"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.();
        }}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}
