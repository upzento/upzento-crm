"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn("inline-flex items-center justify-center rounded-md font-medium", className)}
      {...props}
    />
  );
}