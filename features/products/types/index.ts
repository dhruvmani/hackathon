export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  images: string[];
  thumbnail: string;
}

export interface FilterState {
  search: string;
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy:
    | "price-asc"
    | "price-desc"
    | "rating-desc"
    | "discount-desc"
    | "title-asc";
}

export interface ComparisonState {
  productIds: number[];
}

export interface ChartDataPoint {
  name: string;
  price: number;
  discount: number;
  rating: number;
}

export interface RadarDataPoint {
  metric: string;
  [productName: string]: string | number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse {
  products: Product[];
  pagination: PaginationMeta;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: FilterState["sortBy"];
}

export interface ProductsMetadata {
  categories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
}
