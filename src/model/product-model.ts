import { Variant } from "./variant-model";

export interface Product {
  uuid: string;
  title: string;
  description: string;
  product_type: string;
  vendor: string;
  tags: string[];
  status: string;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  variants: Variant[];
}

export interface CreateProductRequest {
  title: string;
  description: string;
  product_type: string;
  vendor: string;
  tags: string[];
  status: string;
  variants: import("./variant-model").CreateVariantRequest[];
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  product_type?: string;
  vendor?: string;
  tags?: string[];
  status?: string;
  variants?: import("./variant-model").UpdateVariantRequest[];
}

export interface ProductResponse {
  uuid: string;
  title: string;
  description: string;
  product_type: string;
  vendor: string;
  tags: string[];
  status: string;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  variants: Variant[];
}

export interface PaginatedProductsResponse {
  data: ProductResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductDetailResponse {
  uuid: string;
  title: string;
  description: string;
  product_type: string;
  vendor: string;
  tags: string[];
  status: string;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  variants: Variant[];
}

export interface DeleteProductResponse {
  data: boolean;
}

export interface ErrorResponse {
  errors: string | Array<{
    field: string;
    message: string;
  }>;
}
