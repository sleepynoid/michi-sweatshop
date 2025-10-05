import { InventoryItem } from "./inventory-item-model";
import { Image } from "./image-model";

export interface Variant {
  uuid: string;
  title: string;
  price: number;
  sku: string;
  inventory_quantity: number;
  inventory_policy: string;
  option1: string;
  created_at: Date;
  updated_at: Date;
  images?: Image[];
  inventory_item?: InventoryItem;
}

export interface CreateVariantRequest {
  productId?: string;
  title: string;
  price: number;
  sku: string;
  inventory_policy: string;
  option1: string;
  inventory_item: import("./inventory-item-model").CreateInventoryItemRequest;
}

export interface UpdateVariantRequest {
  uuid: string;
  title?: string;
  price?: number;
  sku?: string;
  inventory_policy?: string;
  option1?: string;
  inventory_item?: import("./inventory-item-model").UpdateInventoryItemRequest;
}
