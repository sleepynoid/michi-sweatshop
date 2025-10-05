export interface Image {
  uuid: string;
  url: string;
  alt_text: string | null;
  position: number;
  created_at: Date;
  updated_at: Date;
  productId: string | null;
  variantId: string | null;
}

export interface CreateImageRequest {
  url: string;
  alt_text?: string;
  position?: number;
}

export interface UpdateImageRequest {
  url?: string;
  alt_text?: string;
  position?: number;
}
