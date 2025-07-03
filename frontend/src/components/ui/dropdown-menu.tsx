"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function DropdownMenu({ children }) {
  return <div className="relative inline-block text-left">{children}</div>;
}

export function DropdownMenuTrigger({ children, asChild }) {
  return <div>{children}</div>;
}

export function DropdownMenuContent({ children, align = "end", className }) {
  return <div className={cn("z-50 min-w-[8rem] rounded-md border shadow-md", className)}>{children}</div>;
}

export function DropdownMenuLabel({ className, ...props }) {
  return <div className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />;
}

export function DropdownMenuSeparator({ className }) {
  return <div className={cn("my-1 h-px bg-muted", className)} />;
}

export function DropdownMenuItem({ className, ...props }) {
  return <button className={cn("relative flex w-full px-2 py-1.5 text-sm", className)} {...props} />;
}