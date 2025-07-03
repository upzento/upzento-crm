"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

// Create a CSS variables for our cosmic theme
const createCssVariables = () => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  
  // Dark Theme (Default)
  root.style.setProperty("--background", "#0F1123");
  root.style.setProperty("--surface", "#1A1C2E");
  root.style.setProperty("--primary", "#3D5AFE");
  root.style.setProperty("--secondary", "#FF4081");
  root.style.setProperty("--accent", "#FFD700");
  root.style.setProperty("--error", "#FF3D00");
  root.style.setProperty("--success", "#00E676");
  root.style.setProperty("--warning", "#FFEA00");
  root.style.setProperty("--text-primary", "#FFFFFF");
  root.style.setProperty("--text-secondary", "#B0B0C0");

  // Add CSS variables for gradients
  root.style.setProperty(
    "--cosmic-gradient",
    "linear-gradient(to right, #3D5AFE, #AA00FF)"
  );
  root.style.setProperty(
    "--nebula-gradient",
    "linear-gradient(to right, #FF4081, #AA00FF)"
  );
  root.style.setProperty(
    "--aurora-gradient",
    "linear-gradient(to right, #00E676, #3D5AFE)"
  );
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    createCssVariables();
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
} 