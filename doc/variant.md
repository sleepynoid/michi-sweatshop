# Variant API Specification

## Create Variant

Endpoint: POST /api/variants

Request Header:
- Authorization: Bearer token

Request Body:

```json
{
  "productId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Large Size",
  "price": 900000,
  "sku": "FIG-KAELA-002-L",
  "inventory_policy": "deny",
  "option1": "Large",
  "inventory_item": {
    "sku": "FIG-KAELA-002-L",
    "tracked": true,
    "available": 50,
    "cost": 550000
  }
}
```

Response Body (Success):

```json
{
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440002",
    "title": "Large Size",
    "price": 900000,
    "sku": "FIG-KAELA-002-L",
    "inventory_quantity": 50,
    "inventory_policy": "deny",
    "option1": "Large",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "images": [],
    "inventory_item": {
      "uuid": "550e8400-e29b-41d4-a716-446655440003",
      "sku": "FIG-KAELA-002-L",
      "tracked": true,
      "available": 50,
      "cost": 550000,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

Response Body (Failed - Product Not Found):

```json
{
  "errors": "Product not found"
}
```

Response Body (Failed - SKU Already Exists):

```json
{
  "errors": "SKU already exists"
}
```

Response Body (Failed - Validation):

```json
{
  "errors": [
    {
      "field": "sku",
      "message": "SKU must not be blank"
    },
    {
      "field": "price",
      "message": "Price must be a positive number"
    }
  ]
}
```

## Get Variant by ID

Endpoint: GET /api/variants/{uuid}

Response Body (Success):

```json
{
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440002",
    "title": "Large Size",
    "price": 900000,
    "sku": "FIG-KAELA-002-L",
    "inventory_quantity": 50,
    "inventory_policy": "deny",
    "option1": "Large",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "images": [],
    "inventory_item": {
      "uuid": "550e8400-e29b-41d4-a716-446655440003",
      "sku": "FIG-KAELA-002-L",
      "tracked": true,
      "available": 50,
      "cost": 550000,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

Response Body (Not Found):

```json
{
  "errors": "Variant not found"
}
```

## Update Variant

Endpoint: PATCH /api/variants/{uuid}

Request Header:
- Authorization: Bearer token

Request Body:

```json
{
  "title": "Extra Large Size",
  "price": 950000,
  "sku": "FIG-KAELA-002-XL",
  "inventory_policy": "deny",
  "option1": "Extra Large",
  "inventory_item": {
    "sku": "FIG-KAELA-002-XL",
    "tracked": true,
    "available": 45,
    "cost": 580000
  }
}
```

Response Body (Success):

```json
{
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440002",
    "title": "Extra Large Size",
    "price": 950000,
    "sku": "FIG-KAELA-002-XL",
    "inventory_quantity": 45,
    "inventory_policy": "deny",
    "option1": "Extra Large",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-03T00:00:00.000Z",
    "images": [],
    "inventory_item": {
      "uuid": "550e8400-e29b-41d4-a716-446655440003",
      "sku": "FIG-KAELA-002-XL",
      "tracked": true,
      "available": 45,
      "cost": 580000,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-03T00:00:00.000Z"
    }
  }
}
```

Response Body (Not Found):

```json
{
  "errors": "Variant not found"
}
```

Response Body (Failed - Validation):

```json
{
  "errors": [
    {
      "field": "price",
      "message": "Price must be a positive number"
    }
  ]
}
```

## Variant Data Structure

### Variant Fields:
- **uuid**: Unique identifier for the variant
- **title**: Display name of the variant
- **price**: Price in cents (integer)
- **sku**: Stock Keeping Unit (unique identifier)
- **inventory_quantity**: Available quantity in inventory
- **inventory_policy**: Inventory management policy ("deny" or "continue")
- **option1**: Option value (e.g., "Small", "Medium", "Large")
- **created_at**: Variant creation timestamp
- **updated_at**: Last modification timestamp
- **images**: Array of associated images (can be empty)
- **inventory_item**: Associated inventory item details

### Inventory Item Fields:
- **uuid**: Unique identifier for the inventory item
- **sku**: Stock Keeping Unit (matches variant SKU)
- **tracked**: Whether inventory is tracked (boolean)
- **available**: Available quantity
- **cost**: Cost price in cents (integer)
- **created_at**: Inventory item creation timestamp
- **updated_at**: Last modification timestamp

## Business Rules

### SKU Uniqueness:
- Each variant must have a unique SKU across the entire system
- SKU cannot be changed to an existing SKU during updates

### Product Association:
- Variants must be associated with an existing product via `productId`
- Cannot create variants for non-existent products

### Inventory Management:
- `inventory_policy` determines behavior when inventory is insufficient:
  - `"deny"`: Prevent sale when out of stock
  - `"continue"`: Allow sale even when out of stock
- `inventory_quantity` is automatically updated based on `inventory_item.available`

### Required Fields:
- `productId`: Must reference an existing product
- `title`: Display name (cannot be blank)
- `price`: Must be a positive integer
- `sku`: Must be unique and not blank
- `inventory_policy`: Must be either "deny" or "continue"
- `option1`: Option value (cannot be blank)
- `inventory_item`: Complete inventory item details required

## Example Usage

### Create a Size Variant:

```bash
curl -X POST "http://localhost:3000/api/variants" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Medium Size",
    "price": 850000,
    "sku": "FIG-KAELA-002-M",
    "inventory_policy": "deny",
    "option1": "Medium",
    "inventory_item": {
      "sku": "FIG-KAELA-002-M",
      "tracked": true,
      "available": 75,
      "cost": 520000
    }
  }'
```

### Update Variant Price:

```bash
curl -X PATCH "http://localhost:3000/api/variants/550e8400-e29b-41d4-a716-446655440002" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 920000,
    "inventory_item": {
      "available": 48
    }
  }'
```

### Get Variant Details:

```bash
curl -X GET "http://localhost:3000/api/variants/550e8400-e29b-41d4-a716-446655440002" \
  -H "Authorization: Bearer your-jwt-token"
