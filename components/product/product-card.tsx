"use client"

import { Star, Plus, Check, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/features/products/types"

interface ProductCardProps {
  product: Product
  isSelected: boolean
  onToggleCompare: (id: number) => void
}

export function ProductCard({
  product,
  isSelected,
  onToggleCompare,
}: ProductCardProps) {
  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100

  return (
    <Card className="group flex flex-col overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.discountPercentage > 5 && (
          <Badge
            variant="destructive"
            className="absolute left-3 top-3 gap-1 rounded-lg"
          >
            <Tag className="h-3 w-3" aria-hidden="true" />
            {Math.round(product.discountPercentage)}% OFF
          </Badge>
        )}
        <Badge
          className={`absolute right-3 top-3 rounded-lg ${
            product.availabilityStatus === "In Stock"
              ? "bg-secondary text-secondary-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          {product.availabilityStatus}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-col gap-1">
          {product.brand && (
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {product.brand}
            </span>
          )}
          <h3 className="line-clamp-2 font-serif text-base font-bold leading-tight text-foreground">
            {product.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5" aria-label={`Rating: ${product.rating} out of 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(product.rating)
                    ? "fill-secondary text-secondary"
                    : "text-muted"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.rating.toFixed(1)})
          </span>
        </div>

        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <Button
          onClick={() => onToggleCompare(product.id)}
          variant={isSelected ? "default" : "outline"}
          className={`w-full rounded-xl transition-all duration-300 ${
            isSelected
              ? "bg-primary text-primary-foreground"
              : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          }`}
          aria-pressed={isSelected}
          aria-label={
            isSelected
              ? `Remove ${product.title} from comparison`
              : `Add ${product.title} to comparison`
          }
        >
          {isSelected ? (
            <>
              <Check className="mr-2 h-4 w-4" aria-hidden="true" />
              In Comparison
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Compare
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
