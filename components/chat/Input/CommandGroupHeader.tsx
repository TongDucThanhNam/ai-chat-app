import React, { memo, useCallback } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommandGroupHeaderProps {
  label: string;
  icon?: LucideIcon;
  onIconClick?: () => void;
}

export const CommandGroupHeader = memo(function CommandGroupHeader({
  label,
  icon: Icon,
  onIconClick,
}: CommandGroupHeaderProps) {
  // Sử dụng useCallback để tránh tạo lại hàm mỗi lần render
  const handleIconClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onIconClick?.();
    },
    [onIconClick],
  );

  // Render có điều kiện để tránh tính toán không cần thiết
  const renderIcon = () => {
    if (!Icon) return null;

    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 rounded-sm hover:bg-accent hover:text-accent-foreground"
        onClick={handleIconClick}
        aria-label={`${label} options`}
      >
        <Icon className="h-4 w-4" />
      </Button>
    );
  };

  return (
    <div className="flex items-center justify-between px-2 py-1.5">
      <span className="text-sm font-medium text-muted-foreground select-none">
        {label}
      </span>
      {renderIcon()}
    </div>
  );
});
