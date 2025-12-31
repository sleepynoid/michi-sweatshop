# Product API Specification

## Create Product

Endpoint: POST /api/products

Request Header:

- Authorization: Bearer token

Request Body:

```json
{
  "title": "Figure",
  "description": "Figure Kawai Kaela",
  "product_type": "Collectible",
  "vendor": "Kawai",
  "tags": ["figure", "collectible", "kaela"],
  "status": "active",
  "variants": [
    {
      "title": "Default Variant",
      "price": 800000,
      "sku": "FIG-KAELA-001",
      "inventory_policy": "deny",
      "option1": "Standard",
      "inventory_item": {
        "sku": "FIG-KAELA-001",
        "tracked": true,
        "available": 100,
        "cost": 500000
      }
    }
  ]
}
```

Response Body (Success):

```json
{
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Figure",
    "description": "Figure Kawai Kaela",
    "product_type": "Collectible",
    "vendor": "Kawai",
    "tags": ["figure", "collectible", "kaela"],
    "status": "active",
    "published_at": "2023-01-01T00:00:00.000Z",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "variants": [
      {
        "uuid": "550e8400-e29b-41d4-a716-446655440001",
        "title": "Default Variant",
        "price": 800000,
        "sku": "FIG-KAELA-001",
        "inventory_quantity": 100,
        "inventory_policy": "deny",
        "option1": "Standard",
        "created_at": "2023-01-01T00:00:00.000Z",
        "updated_at": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

Response Body (Failed):

```json
{
  "errors": [
    {
      "field": "title",
      "message": "Title must not be blank"
    },
    {
      "field": "variants[0].price",
      "message": "Price must be a positive number"
    }
  ]
}
```

## Get Products

Endpoint: GET /api/products?page=1&limit=10

Response Body (Success):

```json
{
  "data": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Figure",
      "description": "Figure Kawai Kaela",
      "product_type": "Collectible",
      "vendor": "Kawai",
      "tags": ["figure", "collectible", "kaela"],
      "status": "active",
      "published_at": "2023-01-01T00:00:00.000Z",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z",
      "variants": [
        {
          "uuid": "550e8400-e29b-41d4-a716-446655440001",
          "title": "Default Variant",
          "price": 800000,
          "sku": "FIG-KAELA-001",
          "inventory_quantity": 100,
          "inventory_policy": "deny",
          "option1": "Standard",
          "created_at": "2023-01-01T00:00:00.000Z",
          "updated_at": "2023-01-01T00:00:00.000Z"
        }
      ]
    },
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440002",
      "title": "Figure",
      "description": "Figure Kawai Elaine",
      "product_type": "Collectible",
      "vendor": "Kawai",
      "tags": ["figure", "collectible", "elaine"],
      "status": "active",
      "published_at": "2023-01-02T00:00:00.000Z",
      "created_at": "2023-01-02T00:00:00.000Z",
      "updated_at": "2023-01-02T00:00:00.000Z",
      "variants": [
        {
          "uuid": "550e8400-e29b-41d4-a716-446655440003",
          "title": "Default Variant",
          "price": 700000,
          "sku": "FIG-ELAINE-001",
          "inventory_quantity": 50,
          "inventory_policy": "deny",
          "option1": "Standard",
          "created_at": "2023-01-02T00:00:00.000Z",
          "updated_at": "2023-01-02T00:00:00.000Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

## Get Product by ID

Endpoint: GET /api/products/{uuid}

Response Body (Success):

```json
{
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Figure",
    "description": "Figure Kawai Kaela",
    "product_type": "Collectible",
    "vendor": "Kawai",
    "tags": ["figure", "collectible", "kaela"],
    "status": "active",
    "published_at": "2023-01-01T00:00:00.000Z",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "variants": [
      {
        "uuid": "550e8400-e29b-41d4-a716-446655440001",
        "title": "Default Variant",
        "price": 800000,
        "sku": "FIG-KAELA-001",
        "inventory_quantity": 100,
        "inventory_policy": "deny",
        "option1": "Standard",
        "created_at": "2023-01-01T00:00:00.000Z",
        "updated_at": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

Response Body (Not Found):

```json
{
  "errors": "Product not found"
}
```

## Get Product Detail

Endpoint: GET /api/products/{uuid}/detail

Response Body (Success):

```json
{
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Figure",
    "description": "Figure Kawai Kaela",
    "product_type": "Collectible",
    "vendor": "Kawai",
    "tags": ["figure", "collectible", "kaela"],
    "status": "active",
    "published_at": "2023-01-01T00:00:00.000Z",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "variants": [
      {
        "uuid": "550e8400-e29b-41d4-a716-446655440001",
        "title": "Default Variant",
        "price": 800000,
        "sku": "FIG-KAELA-001",
        "inventory_quantity": 100,
        "inventory_policy": "deny",
        "option1": "Standard",
        "created_at": "2023-01-01T00:00:00.000Z",
        "updated_at": "2023-01-01T00:00:00.000Z",
        "inventory_item": {
          "uuid": "550e8400-e29b-41d4-a716-446655440001",
          "sku": "FIG-KAELA-001",
          "tracked": true,
          "available": 100,
          "cost": 500000,
          "created_at": "2023-01-01T00:00:00.000Z",
          "updated_at": "2023-01-01T00:00:00.000Z"
        }
      }
    ]
  }
}
```

Response Body (Not Found):

```json
{
  "errors": "Product not found"
}
```

## Update Product

Endpoint: PATCH /api/products/{uuid}

Request Header:

- Authorization: Bearer token

Request Body:

```json
{
  "title": "Updated Figure",
  "description": "Updated Figure Kawai Kaela",
  "product_type": "Collectible",
  "vendor": "Kawai",
  "tags": ["figure", "collectible", "kaela", "updated"],
  "status": "active",
  "variants": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Updated Variant",
      "price": 850000,
      "sku": "FIG-KAELA-001",
      "inventory_policy": "deny",
      "option1": "Standard",
      "inventory_item": {
        "sku": "FIG-KAELA-001",
        "tracked": true,
        "available": 90,
        "cost": 520000
      }
    }
  ]
}
```

Response Body (Success):

```json
{
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Updated Figure",
    "description": "Updated Figure Kawai Kaela",
    "product_type": "Collectible",
    "vendor": "Kawai",
    "tags": ["figure", "collectible", "kaela", "updated"],
    "status": "active",
    "published_at": "2023-01-01T00:00:00.000Z",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-03T00:00:00.000Z",
    "variants": [
      {
        "uuid": "550e8400-e29b-41d4-a716-446655440001",
        "title": "Updated Variant",
        "price": 850000,
        "sku": "FIG-KAELA-001",
        "inventory_quantity": 90,
        "inventory_policy": "deny",
        "option1": "Standard",
        "created_at": "2023-01-01T00:00:00.000Z",
        "updated_at": "2023-01-03T00:00:00.000Z"
      }
    ]
  }
}
```

Response Body (Failed):

```json
{
  "errors": [
    {
      "field": "variants[0].price",
      "message": "Price must be a positive number"
    }
  ]
}
```

## Delete Product

Endpoint: DELETE /api/products/{uuid}

Request Header:

- Authorization: Bearer token

Response Body (Success):

```json
{
  "data": true
}
```

Response Body (Not Found):

```json
{
  "errors": "Product not found"
}
```

## Upload Product Image

Endpoint: POST /api/products/{uuid}/images/upload

Request Header:

- Authorization: Bearer token
- Content-Type: multipart/form-data

Request Body (Form Data):

- image: File (required) - Image file (JPEG, PNG, GIF, WebP)
- alt_text: String (optional) - Alternative text for the image
- position: Number (optional) - Display position of the image (auto-assigned if not provided)

Response Body (Success):

```json
{
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440004",
    "url": "/uploads/products/550e8400-e29b-41d4-a716-446655440000/unique-filename.jpg",
    "alt_text": "Product main image",
    "position": 0,
    "filename": "unique-filename.jpg",
    "size": 245760,
    "mime_type": "image/jpeg",
    "created_at": "2025-10-05T14:00:00.000Z",
    "updated_at": "2025-10-05T14:00:00.000Z",
    "productId": "550e8400-e29b-41d4-a716-446655440000",
    "variantId": null
  }
}
```

Response Body (Validation Failed):

```json
{
  "errors": "File must be an image"
}
```

Response Body (File Too Large):

```json
{
  "errors": "File too large (max 2MB)"
}
```

Response Body (No File Uploaded):

```json
{
  "errors": "No file uploaded"
}
```

Response Body (Product Not Found):

```json
{
  "errors": "Product not found"
}
```

Response Body (Unauthorized):

```json
{
  "errors": "Unauthorized"
}
```

### File Upload Specifications

- **Supported Formats**: JPEG, PNG, GIF, WebP, and other image formats
- **Maximum File Size**: 2MB
- **Storage Location**: `./uploads/products/{productId}/`
- **File Naming**: UUID-based unique filename to prevent conflicts
- **Access**: Public access via `/uploads/*` static route

### Example Usage (cURL)

```bash
```bash
curl -X POST "http://localhost:4000/api/products/550e8400-e29b-41d4-a716-446655440000/images/upload" \
  -H "Authorization: Bearer your-jwt-token" \
  -F "image=@/path/to/image.jpg" \
  -F "alt_text=Product main image" \
  -F "position=0"
```

### Example Usage (JavaScript/Fetch)

```javascript
const formData = new FormData();
formData.append('image', imageFile);
formData.append('alt_text', 'Product main image');
formData.append('position', '0');

const response = await fetch('/api/products/{productId}/images/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
```

## Upload Product Image (Link URL)

Use this endpoint to **link** an external image URL to the product. The image is NOT downloaded to the server, only the URL is stored.

Endpoint: POST /api/products/{uuid}/images

Request Header:

- Authorization: Bearer token
- Content-Type: application/json

Request Body:

```json
{
  "url": "https://example.com/images/product-image.jpg",
  "alt_text": "Product image description",
  "position": 0
}
```

Response Body (Success):

```json
{
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440005",
    "url": "https://example.com/images/product-image.jpg",
    "alt_text": "Product image description",
    "position": 0,
    "created_at": "2025-10-05T14:00:00.000Z",
    "updated_at": "2025-10-05T14:00:00.000Z",
    "productId": "550e8400-e29b-41d4-a716-446655440000",
    "variantId": null
  }
}
```

Response Body (Failed):

```json
{
  "errors": [
    {
      "field": "url",
      "message": "URL must not be blank"
    }
  ]
}
```

## Access Uploaded Images

Uploaded images are accessible via public URLs:

```
http://localhost:4000/uploads/products/{productId}/{filename}
```

### Example

```
http://localhost:4000/uploads/products/550e8400-e29b-41d4-a716-446655440000/unique-filename.jpg
```

### Image Metadata Fields

- **uuid**: Unique identifier for the image record
- **url**: Full URL path to access the image
- **alt_text**: Alternative text for accessibility
- **position**: Display order (0-based indexing)
- **filename**: Original filename stored on disk
- **size**: File size in bytes
- **mime_type**: MIME type of the image file
- **created_at**: Image upload timestamp
- **updated_at**: Last modification timestamp
- **productId**: Associated product UUID
- **variantId**: Associated variant UUID (null for product images)

## Delete Product Image

Endpoint: DELETE /api/products/{uuid}/images/{imageId}

Request Header:

- Authorization: Bearer token

Response Body (Success):

```json
{
  "data": true
}
```

Response Body (Product Not Found):

```json
{
  "errors": "Product not found"
}
```

Response Body (Image Not Found):

```json
{
  "errors": "Image not found"
}
```

Response Body (Unauthorized):

```json
{
  "errors": "Unauthorized"
}
```

### Notes

- For locally stored images (URLs starting with `/uploads/`), the file will also be deleted from disk.
- For externally linked images (URLs starting with `http://` or `https://`), only the database record is removed.

### Example Usage (cURL)

```bash
curl -X DELETE "http://localhost:4000/api/products/550e8400-e29b-41d4-a716-446655440000/images/f47ac10b-58cc-4372-a567-0e02b2c3d479" \
  -H "Authorization: Bearer your-jwt-token"
```
