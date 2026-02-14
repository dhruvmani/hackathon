"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buildBarChartData } from "@/features/comparison/utils"
import type { Product } from "@/features/products/types"

const CHART_COLORS = [
  "hsl(174, 79%, 12%)",
  "hsl(66, 30%, 56%)",
  "hsl(42, 33%, 50%)",
  "hsl(0, 0%, 30%)",
  "hsl(174, 50%, 30%)",
]

interface PriceBarChartProps {
  products: Product[]
}

export function PriceBarChart({ products }: PriceBarChartProps) {
  const data = buildBarChartData(products)

  return (
    <Card className="rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-serif text-lg">Price Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72" role="img" aria-label="Bar chart comparing product prices">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(42, 15%, 82%)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(0, 0%, 35%)" }}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(0, 0%, 35%)" }}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                contentStyle={{
                  background: "hsl(42, 33%, 97%)",
                  border: "1px solid hsl(42, 15%, 82%)",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                }}
              />
              <Bar dataKey="price" radius={[8, 8, 0, 0]}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
