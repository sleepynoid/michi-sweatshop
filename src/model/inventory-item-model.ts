export interface InventoryItem {
  uuid: string;
  sku: string;
  tracked: boolean;
  available: number;
  cost: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateInventoryItemRequest {
  sku: string;
  tracked: boolean;
  available: number;
  cost: number;
}

export interface UpdateInventoryItemRequest {
  sku?: string;
  tracked?: boolean;
  available?: number;
  cost?: number;
}
