"use client"

import { COMPARISON_MAX, COMPARISON_STORAGE_KEY } from "@/lib/constants"

export function getComparisonIds(): number[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(COMPARISON_STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveComparisonIds(ids: number[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(ids))
}

export function addToComparison(id: number): {
  success: boolean
  message: string
  ids: number[]
} {
  const current = getComparisonIds()

  if (current.includes(id)) {
    return {
      success: false,
      message: "Product is already in comparison",
      ids: current,
    }
  }

  if (current.length >= COMPARISON_MAX) {
    return {
      success: false,
      message: `Maximum ${COMPARISON_MAX} products can be compared`,
      ids: current,
    }
  }

  const updated = [...current, id]
  saveComparisonIds(updated)
  return {
    success: true,
    message: "Product added to comparison",
    ids: updated,
  }
}

export function removeFromComparison(id: number): {
  success: boolean
  ids: number[]
} {
  const current = getComparisonIds()
  const updated = current.filter((existingId) => existingId !== id)
  saveComparisonIds(updated)
  return { success: true, ids: updated }
}

export function clearComparison(): void {
  saveComparisonIds([])
}

export function isInComparison(id: number): boolean {
  return getComparisonIds().includes(id)
}
