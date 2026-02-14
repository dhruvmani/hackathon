"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/features/products/hooks/use-debounce"
import { DEBOUNCE_DELAY } from "@/lib/constants"
import type { Product } from "@/features/products/types"

interface SearchInputProps {
  onSearch: (query: string) => void
  products: Product[]
}

export function SearchInput({ onSearch, products }: SearchInputProps) {
  const [value, setValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const debouncedValue = useDebounce(value, DEBOUNCE_DELAY)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  const suggestions = value.length >= 2
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(value.toLowerCase()) ||
            p.brand?.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 6)
    : []

  const handleSelect = useCallback(
    (title: string) => {
      setValue(title)
      onSearch(title)
      setShowSuggestions(false)
      setSelectedIndex(-1)
    },
    [onSearch]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          )
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSelect(suggestions[selectedIndex].title)
          }
          break
        case "Escape":
          setShowSuggestions(false)
          setSelectedIndex(-1)
          break
      }
    },
    [showSuggestions, suggestions, selectedIndex, handleSelect]
  )

  const handleClear = useCallback(() => {
    setValue("")
    onSearch("")
    setShowSuggestions(false)
    inputRef.current?.focus()
  }, [onSearch])

  return (
    <div className="relative w-full" role="combobox" aria-expanded={showSuggestions} aria-haspopup="listbox">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search products, brands..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setShowSuggestions(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => value.length >= 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          className="rounded-xl pl-10 pr-10"
          aria-label="Search products"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          ref={suggestionsRef}
          role="listbox"
          className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-xl border bg-card shadow-lg"
        >
          {suggestions.map((product, index) => (
            <li
              key={product.id}
              role="option"
              aria-selected={index === selectedIndex}
              className={`cursor-pointer px-4 py-3 text-sm transition-colors ${
                index === selectedIndex
                  ? "bg-primary/10 text-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
              onMouseDown={() => handleSelect(product.title)}
            >
              <span className="font-medium">{product.title}</span>
              {product.brand && (
                <span className="ml-2 text-muted-foreground">
                  {"by "}
                  {product.brand}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
