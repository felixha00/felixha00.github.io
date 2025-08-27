"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface KeycapButtonProps {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    disabled?: boolean
}

export function KeycapButton({ children, onClick, className, disabled = false }: KeycapButtonProps) {
    const [isPressed, setIsPressed] = useState(false)

    const handleMouseDown = () => {
        if (!disabled) {
            setIsPressed(true)
        }
    }

    const handleMouseUp = () => {
        setIsPressed(false)
    }

    const handleMouseLeave = () => {
        setIsPressed(false)
    }

    const handleClick = () => {
        if (!disabled && onClick) {
            onClick()
        }
    }

    return (
        <button
            className={cn(
                // Base keycap styling
                "relative inline-flex items-center justify-center",
                "min-h-9 px-4 py-2",
                "font-mono font-medium text-sm",
                "rounded",
                "transition-all duration-75 ease-out",
                "select-none",

                // Keycap colors and shadows
                // "bg-gradient-to-b from-neutral-100 to-neutral-200",
                "text-neutral-800",
                "border border-neutral-300",

                // 3D effect - raised state
                !isPressed && !disabled && ["shadow-[0_4px_0_0_#9ca3af,0_6px_8px_0_rgba(0,0,0,0.15)]", "translate-y-0"],

                // 3D effect - pressed state
                isPressed && !disabled && ["shadow-[0_1px_0_0_#9ca3af,0_2px_4px_0_rgba(0,0,0,0.1)]", "translate-y-1"],

                // Hover effect
                !isPressed && !disabled && "hover:from-neutral-50 hover:to-neutral-150",

                // Disabled state
                disabled && ["opacity-50 cursor-not-allowed", "shadow-[0_2px_0_0_#d1d5db,0_3px_4px_0_rgba(0,0,0,0.1)]"],

                // Dark mode
                // "dark:from-neutral-700 dark:to-neutral-800",
                "dark:text-neutral-200",
                "dark:border-neutral-600",

                !isPressed && !disabled && ["dark:shadow-[0_4px_0_0_#4b5563,0_6px_8px_0_rgba(0,0,0,0.3)]"],

                isPressed && !disabled && ["dark:shadow-[0_1px_0_0_#4b5563,0_2px_4px_0_rgba(0,0,0,0.2)]"],

                !isPressed && !disabled && "dark:hover:from-neutral-600 dark:hover:to-neutral-700",

                className,
            )}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
