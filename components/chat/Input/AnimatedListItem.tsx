"use client"

import React, {memo, useCallback, useMemo} from "react";
import {motion} from "framer-motion";
import {CommandItem} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {ProviderIcon} from "./ProviderIcon";
import {Download, Settings} from 'lucide-react';
import type {Model} from "@/types";
import {Button} from "@/components/ui/button";

// Di chuyển animation variants ra ngoài component
const containerVariants = {
    initial: {x: -20, opacity: 0},
    animate: (index: number) => ({
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24,
            delay: index * 0.05,
            duration: 0.3,
        }
    })
};

const downloadIconVariants = {
    initial: {opacity: 0, scale: 0},
    animate: (index: number) => ({
        opacity: 1,
        scale: 1,
        transition: {
            delay: index * 0.05 + 0.2,
            duration: 0.3,
            type: "spring",
        }
    })
};

// Tạo component con được memoized cho download icon
const DownloadIcon = memo(function DownloadIcon({index}: { index: number }) {
    return (
        <motion.div
            className="ml-auto"
            variants={downloadIconVariants}
            initial="initial"
            animate="animate"
            custom={index}
        >
            <button
            >
                <Settings className="h-4 w-4 opacity-50 flex-shrink-0"/>
            </button>
        </motion.div>
    );
});

interface AnimatedListItemProps {
    model: Model;
    onSelect: () => void;
    showDownloadIcon?: boolean;
    isActive?: boolean;
    isPinned?: boolean;
    onHover: (id: string | null) => void;
    index: number;
}

export const AnimatedListItem = memo(function AnimatedListItem({
                                                                   model,
                                                                   onSelect,
                                                                   showDownloadIcon,
                                                                   isActive,
                                                                   isPinned,
                                                                   onHover,
                                                                   index,
                                                               }: AnimatedListItemProps) {
    const itemId = useMemo(() => isPinned ? `pinned-${model.id}` : model.id, [isPinned, model.id]);

    const handleMouseEnter = useCallback(() => {
        onHover(itemId);
    }, [onHover, itemId]);

    const handleMouseLeave = useCallback(() => {
        onHover(null);
    }, [onHover]);

    // Tính toán className một lần duy nhất khi các dependencies thay đổi
    const itemClassName = useMemo(() => {
        return cn(
            "flex items-center gap-2 py-3 transition-colors duration-150",
            model.id === "gpt-4o-mini" && "bg-green-50 dark:bg-gray-900",
        );
    }, [model.id]);

    return (
        <CommandItem
            key={itemId}
            value={itemId}
            onSelect={onSelect}
            className={itemClassName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className="flex items-center gap-2 w-full"
                variants={containerVariants}
                initial="initial"
                animate="animate"
                custom={index}
            >
                <ProviderIcon provider={model.provider}/>
                <span className="truncate" title={model.name}>
                    {model.name}
                </span>
                {showDownloadIcon && <DownloadIcon index={index}/>}
            </motion.div>
        </CommandItem>
    );
});