"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface StampBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string
  variant?: "default" | "outlined" | "solid"
  size?: "sm" | "md" | "lg"
}

// Status to SVG file mapping
const statusImageMap: Record<string, string> = {
  new_booking: "/images/New Booking.svg",
  ticket_booked: "/images/conform.svg",
  pending_booking: "/images/pending.svg",
  pending_approval: "/images/pending.svg",
  not_booked: "/images/booking failed.svg",
  cancelled: "/images/cancelled.svg",
  refund_amount: "/images/refunded.svg",
  ticket_delivery_paid_amount: "/images/Paid Amount.svg",
  ticket_delivery_duse_amount: "/images/Due Amount.svg",
  pending_amount_by_customer: "/images/Customer Pending.svg"
}

// Fallback colors for statuses without SVG
const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  new_booking: {
    bg: "bg-orange-100",
    text: "text-orange-950",
    border: "border-orange-500"
  },
  ticket_booked: {
    bg: "bg-green-100",
    text: "text-green-900",
    border: "border-green-500"
  },
  pending_booking: {
    bg: "bg-yellow-100",
    text: "text-yellow-900",
    border: "border-yellow-500"
  },
  pending_approval: {
    bg: "bg-yellow-100",
    text: "text-yellow-900",
    border: "border-yellow-500"
  },
  not_booked: {
    bg: "bg-red-100",
    text: "text-red-900",
    border: "border-red-500"
  },
  cancelled: {
    bg: "bg-gray-100",
    text: "text-gray-900",
    border: "border-gray-500"
  },
  refund_amount: {
    bg: "bg-purple-100",
    text: "text-purple-900",
    border: "border-purple-500"
  },
  ticket_delivery_paid_amount: {
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    border: "border-emerald-500"
  },
  ticket_delivery_duse_amount: {
    bg: "bg-orange-100",
    text: "text-orange-900",
    border: "border-orange-500"
  },
  pending_amount_by_customer: {
    bg: "bg-amber-100",
    text: "text-amber-900",
    border: "border-amber-500"
  }
}

function StampBadge({ status, variant = "default", size = "md", className, ...props }: StampBadgeProps) {
  const imagePath = statusImageMap[status] || null
  
  // Generate consistent rotation based on status
  const rotation = React.useMemo(() => {
    const hash = status.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return (hash % 6) - 3 // Between -3 and 3 degrees
  }, [status])

  // Size variants
  const sizeConfig = {
    sm: { width: 110, height: 110 },
    md: { width: 140, height: 140 },
    lg: { width: 170, height: 170 }
  }

  const config = sizeConfig[size]

  // If we have an SVG image, use it directly
  if (imagePath) {
    return (
      <div
        className={cn(
          "relative inline-flex items-center justify-center",
          "cursor-pointer",
          "hover:scale-105 transition-transform duration-200",
          className
        )}
        style={{
          width: `${config.width}px`,
          height: `${config.height}px`,
          transform: `rotate(${rotation}deg)`,
          position: "relative"
        }}
        {...props}
      >
        <Image
          src={imagePath}
          alt={`${status} stamp`}
          width={config.width}
          height={config.height}
          className="w-full h-full object-contain"
          unoptimized
          priority={false}
        />
      </div>
    )
  }

  // Fallback: Use colors if SVG not found
  const colors = statusColors[status] || {
    bg: "bg-blue-100",
    text: "text-blue-900",
    border: "border-blue-500"
  }

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        "px-4 py-2 min-w-[115px]",
        "font-black text-[10px] uppercase tracking-[0.12em] leading-tight",
        colors.bg,
        colors.text,
        "border-4 rounded-full",
        colors.border,
        "cursor-pointer",
        "hover:scale-105 transition-transform duration-200",
        className
      )}
      style={{
        transform: `rotate(${rotation}deg)`,
        position: "relative"
      }}
      {...props}
    >
      <span className="whitespace-nowrap px-1.5 font-extrabold">
        {status.replace(/_/g, ' ').toUpperCase()}
      </span>
    </div>
  )
}

export { StampBadge }
