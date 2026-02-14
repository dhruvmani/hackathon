"use client"

import { Star, Award, DollarSign, Percent, X } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  findCheapest,
  findHighestRated,
  findHighestDiscount,
} from "@/features/comparison/utils"
import type { Product } from "@/features/products/types"

interface ComparisonTableProps {
  products: Product[]
  onRemove: (id: number) => void
}

export function ComparisonTable({ products, onRemove }: ComparisonTableProps) {
  const cheapestId = findCheapest(products)
  const highestRatedId = findHighestRated(products)
  const highestDiscountId = findHighestDiscount(products)

  const rows: {
    label: string
    render: (product: Product) => React.ReactNode
  }[] = [
    {
      label: "Image",
      render: (p) => (
        <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.thumbnail}
            alt={p.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ),
    },
    {
      label: "Brand",
      render: (p) => (
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {p.brand || "N/A"}
        </span>
      ),
    },
    {
      label: "Price",
      render: (p) => (
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-bold text-foreground">
            ${p.price.toFixed(2)}
          </span>
          {p.id === cheapestId && (
            <Badge className="gap-1 bg-secondary text-secondary-foreground">
              <DollarSign className="h-3 w-3" aria-hidden="true" />
              Cheapest
            </Badge>
          )}
        </div>
      ),
    },
    {
      label: "Discount",
      render: (p) => (
        <div className="flex flex-col items-center gap-1">
          <span className="font-medium text-foreground">
            {p.discountPercentage.toFixed(1)}%
          </span>
          {p.id === highestDiscountId && (
            <Badge className="gap-1 bg-secondary text-secondary-foreground">
              <Percent className="h-3 w-3" aria-hidden="true" />
              Best Deal
            </Badge>
          )}
        </div>
      ),
    },
    {
      label: "Rating",
      render: (p) => (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(p.rating)
                    ? "fill-secondary text-secondary"
                    : "text-muted"
                }`}
                aria-hidden="true"
              />
            ))}
            <span className="ml-1 text-sm text-muted-foreground">
              {p.rating.toFixed(1)}
            </span>
          </div>
          {p.id === highestRatedId && (
            <Badge className="gap-1 bg-secondary text-secondary-foreground">
              <Award className="h-3 w-3" aria-hidden="true" />
              Top Rated
            </Badge>
          )}
        </div>
      ),
    },
    {
      label: "Stock",
      render: (p) => (
        <span className="text-sm text-foreground">{p.stock} units</span>
      ),
    },
    {
      label: "Category",
      render: (p) => (
        <Badge variant="outline" className="capitalize">
          {p.category}
        </Badge>
      ),
    },
    {
      label: "Warranty",
      render: (p) => (
        <span className="text-sm text-muted-foreground">
          {p.warrantyInformation}
        </span>
      ),
    },
    {
      label: "Shipping",
      render: (p) => (
        <span className="text-sm text-muted-foreground">
          {p.shippingInformation}
        </span>
      ),
    },
    {
      label: "Return Policy",
      render: (p) => (
        <span className="text-sm text-muted-foreground">
          {p.returnPolicy}
        </span>
      ),
    },
    {
      label: "Dimensions",
      render: (p) => (
        <span className="text-xs text-muted-foreground">
          {p.dimensions.width} x {p.dimensions.height} x {p.dimensions.depth}
        </span>
      ),
    },
    {
      label: "Weight",
      render: (p) => (
        <span className="text-sm text-muted-foreground">{p.weight} kg</span>
      ),
    },
    {
      label: "Min Order",
      render: (p) => (
        <span className="text-sm text-muted-foreground">
          {p.minimumOrderQuantity} units
        </span>
      ),
    },
  ]

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-lg" role="region" aria-label="Product comparison table">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-36 text-sm font-semibold text-foreground">
              Feature
            </TableHead>
            {products.map((product) => (
              <TableHead
                key={product.id}
                className="min-w-[180px] text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="line-clamp-2 font-serif text-sm font-bold text-foreground">
                    {product.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(product.id)}
                    className="h-7 gap-1 text-xs text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${product.title} from comparison`}
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                    Remove
                  </Button>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="whitespace-nowrap text-sm font-medium text-foreground">
                {row.label}
              </TableCell>
              {products.map((product) => (
                <TableCell key={product.id} className="text-center">
                  {row.render(product)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
