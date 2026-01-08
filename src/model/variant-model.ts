import { Image, CreateImageRequest } from "./image-model";

export interface Variant {
  uuid: string;
  title: string;
  price: number;
  sku: string;
  available: number;
  cost: number;
  inventory_policy: string;
  option1: string;
  created_at: Date;
  updated_at: Date;
  images?: Image[];
}

export interface CreateVariantRequest {
  productId?: string;
  title: string;
  price: number;
  sku: string;
  inventory_policy: string;
  option1: string;
  available: number;
  cost: number;
  images?: CreateImageRequest[];
}

export interface UpdateVariantRequest {
  uuid: string;
  title?: string;
  price?: number;
  sku?: string;
  inventory_policy?: string;
  option1?: string;
  available?: number;
  cost?: number;
  images?: CreateImageRequest[];
}
