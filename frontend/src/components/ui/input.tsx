"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
  return <input className={cn("flex h-10 w-full rounded-md border px-3 py-2", className)} {...props} />;
}