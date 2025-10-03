export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  // userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemResponse {
  uuid: string;
  name: string;
  description: string;
  price: number;
  // userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
  price: number;
}

export interface UpdateItemRequest {
  name?: string;
  description?: string;
  price?: number;
}

export interface PaginatedItemsResponse {
  data: ItemResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ItemDetailResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  // user: {
  //   id: number;
  //   username: string;
  //   name: string;
  //   role: string;
  // };
  createdAt: Date;
  updatedAt: Date;
}
