# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username" : "khannedy",
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
    "name" : "Eko Kurniawan Khannedy",
    "role" : "user"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username must not blank, ..."
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username" : "khannedy",
  "password" : "rahasia"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "username" : "khannedy",
    "name" : "Eko Kurniawan Khannedy",
    "role" : "user",
    "token" : "token"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username or password wrong"
}
```
