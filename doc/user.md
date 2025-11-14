# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username" : "khannedy",
  "email" : "khannedy@example.com",
  "phone" : "+628123456789",
  "password" : "rahasia",
  "name" : "Eko Kurniawan Khannedy"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "username" : "khannedy",
    "email" : "khannedy@example.com",
    "phone" : "+628123456789",
    "name" : "Eko Kurniawan Khannedy",
    "role" : "user"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : [
    {
      "field" : "username",
      "message" : "Username must not be blank"
    },
    {
      "field" : "email",
      "message" : "Invalid email format"
    },
    {
      "field" : "phone",
      "message" : "Phone must not be blank"
    },
    {
      "field" : "password",
      "message" : "Password must not be blank"
    }
  ]
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "email" : "khannedy@example.com",
  "password" : "rahasia"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "username" : "khannedy",
    "email" : "khannedy@example.com",
    "phone" : "+628123456789",
    "name" : "Eko Kurniawan Khannedy",
    "role" : "user",
    "token" : "token"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "email or password wrong"
}
```
