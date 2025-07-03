const fs = require('fs');
const path = require('path');

// Ensure directories exist
const componentsDir = path.join(__dirname, 'src', 'components');
const uiDir = path.join(componentsDir, 'ui');
const libDir = path.join(__dirname, 'src', 'lib');

if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

if (!fs.existsSync(uiDir)) {
  fs.mkdirSync(uiDir, { recursive: true });
}

if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true });
}

// Create utils.ts
const utilsContent = `/**
 * Utility functions for the frontend
 */

/**
 * Combines multiple class names into a single string
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}`;

fs.writeFileSync(path.join(libDir, 'utils.ts'), utilsContent);
console.log('Created utils.ts');

// Create button.tsx
const buttonContent = `"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn("inline-flex items-center justify-center rounded-md font-medium", className)}
      {...props}
    />
  );
}`;

fs.writeFileSync(path.join(uiDir, 'button.tsx'), buttonContent);
console.log('Created button.tsx');

// Create card.tsx
const cardContent = `"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return <div className={cn("rounded-lg border bg-card shadow-sm", className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-2xl font-semibold", className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}`;

fs.writeFileSync(path.join(uiDir, 'card.tsx'), cardContent);
console.log('Created card.tsx');

// Create table.tsx
const tableContent = `"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }) {
  return <table className={cn("w-full caption-bottom text-sm", className)} {...props} />;
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }) {
  return <tr className={cn("border-b transition-colors hover:bg-muted/50", className)} {...props} />;
}

export function TableHead({ className, ...props }) {
  return <th className={cn("h-12 px-4 text-left align-middle font-medium", className)} {...props} />;
}

export function TableCell({ className, ...props }) {
  return <td className={cn("p-4 align-middle", className)} {...props} />;
}`;

fs.writeFileSync(path.join(uiDir, 'table.tsx'), tableContent);
console.log('Created table.tsx');

// Create input.tsx
const inputContent = `"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
  return <input className={cn("flex h-10 w-full rounded-md border px-3 py-2", className)} {...props} />;
}`;

fs.writeFileSync(path.join(uiDir, 'input.tsx'), inputContent);
console.log('Created input.tsx');

// Create dropdown-menu.tsx
const dropdownMenuContent = `"use client";

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
}`;

fs.writeFileSync(path.join(uiDir, 'dropdown-menu.tsx'), dropdownMenuContent);
console.log('Created dropdown-menu.tsx');

console.log('All UI components updated successfully!'); 