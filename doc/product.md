# Product API Specification

## Create Product

Endpoint: POST /api/products

Request Header:
- Authorization: Bearer token

Request Body:

```json
{
  "title": "Figure",
  "handle": "figure-kaela",
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
    "handle": "figure-kaela",
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
      "handle": "figure-kaela",
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
      "handle": "figure-elaine",
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
    "handle": "figure-kaela",
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
    "handle": "figure-kaela",
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
  "handle": "updated-figure-kaela",
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
    "handle": "updated-figure-kaela",
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