"use client"

import { useCallback } from "react"
import useSWR, { useSWRConfig } from "swr"
import {
  getComparisonIds,
  addToComparison,
  removeFromComparison,
  clearComparison,
  isInComparison,
} from "../store"

const COMPARISON_KEY = "comparison-ids"

export function useComparison() {
  const { mutate: globalMutate } = useSWRConfig()

  const { data: ids = [] } = useSWR<number[]>(
    COMPARISON_KEY,
    () => getComparisonIds(),
    {
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const refresh = useCallback(() => {
    globalMutate(COMPARISON_KEY)
  }, [globalMutate])

  const add = useCallback(
    (id: number) => {
      const result = addToComparison(id)
      globalMutate(COMPARISON_KEY, result.ids, false)
      return result
    },
    [globalMutate]
  )

  const remove = useCallback(
    (id: number) => {
      const result = removeFromComparison(id)
      globalMutate(COMPARISON_KEY, result.ids, false)
      return result
    },
    [globalMutate]
  )

  const clear = useCallback(() => {
    clearComparison()
    globalMutate(COMPARISON_KEY, [], false)
  }, [globalMutate])

  const toggle = useCallback(
    (id: number) => {
      if (isInComparison(id)) {
        return remove(id)
      }
      return add(id)
    },
    [add, remove]
  )

  const isSelected = useCallback(
    (id: number) => {
      return ids.includes(id)
    },
    [ids]
  )

  return {
    ids,
    count: ids.length,
    add,
    remove,
    clear,
    toggle,
    isSelected,
  }
}
