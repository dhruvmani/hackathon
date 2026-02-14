"use client"

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buildRadarChartData } from "@/features/comparison/utils"
import type { Product } from "@/features/products/types"

const CHART_COLORS = [
  "hsl(174, 79%, 12%)",
  "hsl(66, 30%, 56%)",
  "hsl(42, 33%, 50%)",
  "hsl(0, 0%, 30%)",
  "hsl(174, 50%, 30%)",
]

interface ComparisonRadarChartProps {
  products: Product[]
}

export function ComparisonRadarChart({ products }: ComparisonRadarChartProps) {
  const data = buildRadarChartData(products)
  const productNames = products.map((p) =>
    p.title.length > 15 ? p.title.slice(0, 15) + "..." : p.title
  )

  return (
    <Card className="rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-serif text-lg">
          Multi-Metric Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72" role="img" aria-label="Radar chart comparing products across price, discount, and rating">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="hsl(42, 15%, 82%)" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: 12, fill: "hsl(0, 0%, 35%)" }}
              />
              <PolarRadiusAxis
                tick={{ fontSize: 10, fill: "hsl(0, 0%, 50%)" }}
                domain={[0, 100]}
              />
              {productNames.map((name, i) => (
                <Radar
                  key={name}
                  name={name}
                  dataKey={name}
                  stroke={CHART_COLORS[i % CHART_COLORS.length]}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
              <Tooltip
                contentStyle={{
                  background: "hsl(42, 33%, 97%)",
                  border: "1px solid hsl(42, 15%, 82%)",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "0.75rem" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
