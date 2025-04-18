import { Brain } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface MemoryToggleProps {
  useMemory: boolean;
  setUseMemory: (value: boolean) => void;
}

export function MemoryToggle({ useMemory, setUseMemory }: MemoryToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Brain
        className={cn(
          "w-4 h-4 transition-colors",
          useMemory ? "text-primary" : "text-muted-foreground",
        )}
      />
      <span className="text-sm font-normal text-muted-foreground">Memory</span>
      <Switch
        checked={useMemory}
        onCheckedChange={setUseMemory}
        className={cn(
          "data-[state=checked]:bg-primary",
          "data-[state=unchecked]:bg-input",
        )}
      />
    </div>
  );
}
