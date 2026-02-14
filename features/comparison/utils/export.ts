"use client"

import type { Product } from "@/features/products/types"

export async function exportToPdf(products: Product[]): Promise<void> {
  const { default: jsPDF } = await import("jspdf")
  const { default: autoTable } = await import("jspdf-autotable")

  const doc = new jsPDF({ orientation: "landscape" })

  doc.setFontSize(20)
  doc.setTextColor(6, 55, 55)
  doc.text("CompareHub - Product Comparison", 14, 22)

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30)

  const headers = [
    "Feature",
    ...products.map((p) =>
      p.title.length > 25 ? p.title.slice(0, 25) + "..." : p.title
    ),
  ]

  const rows = [
    ["Brand", ...products.map((p) => p.brand || "N/A")],
    ["Price", ...products.map((p) => `$${p.price.toFixed(2)}`)],
    [
      "Discount",
      ...products.map((p) => `${p.discountPercentage.toFixed(1)}%`),
    ],
    ["Rating", ...products.map((p) => `${p.rating.toFixed(1)} / 5`)],
    ["Stock", ...products.map((p) => `${p.stock} units`)],
    ["Category", ...products.map((p) => p.category)],
    ["Warranty", ...products.map((p) => p.warrantyInformation)],
    ["Shipping", ...products.map((p) => p.shippingInformation)],
    ["Return Policy", ...products.map((p) => p.returnPolicy)],
    [
      "Dimensions",
      ...products.map(
        (p) =>
          `${p.dimensions.width} x ${p.dimensions.height} x ${p.dimensions.depth}`
      ),
    ],
    ["Weight", ...products.map((p) => `${p.weight} kg`)],
    [
      "Min Order",
      ...products.map((p) => `${p.minimumOrderQuantity} units`),
    ],
  ]

  autoTable(doc, {
    startY: 38,
    head: [headers],
    body: rows,
    theme: "grid",
    headStyles: {
      fillColor: [6, 55, 55],
      textColor: [243, 240, 230],
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 30, 30],
    },
    alternateRowStyles: {
      fillColor: [243, 240, 230],
    },
    styles: {
      cellPadding: 4,
      lineColor: [200, 200, 200],
      lineWidth: 0.25,
    },
    columnStyles: {
      0: { fontStyle: "bold", fillColor: [235, 232, 220] },
    },
  })

  doc.save("comparehub-comparison.pdf")
}

export function generateShareableUrl(ids: number[]): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  return `${baseUrl}/compare?ids=${ids.join(",")}`
}
