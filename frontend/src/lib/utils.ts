/**
 * Utility functions for the frontend
 */

/**
 * Combines multiple class names into a single string
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}