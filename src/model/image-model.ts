export interface Image {
  uuid: string;
  url: string;
  alt_text: string | null;
  position: number;
  created_at: Date;
  updated_at: Date;
  productId: string | null;
  variantId: string | null;
  // File metadata
  filename?: string | null;
  size?: number | null;
  mime_type?: string | null;
  width?: number | null;
  height?: number | null;
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
