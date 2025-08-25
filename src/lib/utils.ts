import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// import fs from "fs"
// import path from "path"
// import matter from "gray-matter"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// https://github.com/vercel/examples/blob/main/solutions/blog/app/components/mdx.tsx
export function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}