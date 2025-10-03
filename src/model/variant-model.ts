import { InventoryItem } from "./inventory-item-model";

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
  inventory_item?: InventoryItem;
}

export interface CreateVariantRequest {
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
