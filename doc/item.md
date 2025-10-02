# Item API Spec

## Create Item

Endpoint : POST /api/items

Request Header :
- Authorization : Bearer token

Request Body :

```json
{
  "name" : "Figure",
  "description" : "Figure Kawai Kaela",
  "price" : 800000
}
```

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "name" : "Figure",
    "description" : "Figure Kawai Kaela",
    "price" : 800000,
    "userId" : 1,
    "createdAt" : "2023-01-01T00:00:00.000Z",
    "updatedAt" : "2023-01-01T00:00:00.000Z"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : [
    {
      "field" : "name",
      "message" : "Name must not be blank"
    },
    {
      "field" : "price",
      "message" : "Price must be a positive number"
    }
  ]
}
```

## Get Items

Endpoint : GET /api/items?page=1&limit=10

Request Header :
- Authorization : Bearer token

Response Body (Success) :

```json
{
  "data" : [
    {
      "id" : 1,
      "name" : "Figure",
      "description" : "Figure Kawai Kaela",
      "price" : 800000,
      "userId" : 1,
      "createdAt" : "2023-01-01T00:00:00.000Z",
      "updatedAt" : "2023-01-01T00:00:00.000Z"
    },
    {
      "id" : 2,
      "name" : "Figure",
      "description" : "Figure Kawai Elaine",
      "price" : 700000,
      "userId" : 1,
      "createdAt" : "2023-01-02T00:00:00.000Z",
      "updatedAt" : "2023-01-02T00:00:00.000Z"
    }
  ],
  "pagination" : {
    "page" : 1,
    "limit" : 10,
    "total" : 2,
    "totalPages" : 1
  }
}
```

## Get Item by ID

Endpoint : GET /api/items/{id}

Request Header :
- Authorization : Bearer token

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "name" : "Figure",
    "description" : "Figure Kawai Kaela",
    "price" : 800000,
    "userId" : 1,
    "createdAt" : "2023-01-01T00:00:00.000Z",
    "updatedAt" : "2023-01-01T00:00:00.000Z"
  }
}
```

Response Body (Not Found) :

```json
{
  "errors" : "Item not found"
}
```

## Get Item Detail

Endpoint : GET /api/items/{id}/detail

Request Header :
- Authorization : Bearer token

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "name" : "Figure",
    "description" : "Figure Kawai Kaela",
    "price" : 800000,
    "user" : {
      "id" : 1,
      "username" : "johndoe",
      "name" : "John Doe",
      "role" : "user"
    },
    "createdAt" : "2023-01-01T00:00:00.000Z",
    "updatedAt" : "2023-01-01T00:00:00.000Z"
  }
}
```

Response Body (Not Found) :

```json
{
  "errors" : "Item not found"
}
```

## Update Item

Endpoint : PATCH /api/items/{id}

Request Header :
- Authorization : Bearer token

Request Body :

```json
{
  "name" : "Updated Figure Name",
  "description" : "Updated description",
  "price" : 850000
}
```

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "name" : "Updated Figure Name",
    "description" : "Updated description",
    "price" : 850000,
    "userId" : 1,
    "createdAt" : "2023-01-01T00:00:00.000Z",
    "updatedAt" : "2023-01-03T00:00:00.000Z"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : [
    {
      "field" : "price",
      "message" : "Price must be a positive number"
    }
  ]
}
```

## Delete Item

Endpoint : DELETE /api/items/{id}

Request Header :
- Authorization : Bearer token

Response Body (Success) :

```json
{
  "data" : true
}
```

Response Body (Not Found) :

```json
{
  "errors" : "Item not found"
}
```
