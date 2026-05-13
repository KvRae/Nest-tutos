#  NestJS Scalable API - Complete Examples

This file contains complete, copy-paste ready examples for all API endpoints.

## Base URL
```
http://localhost:3000/api
```

---

## Users Endpoints

### 1. Create a New User
**POST** `/users`

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123"
  }'
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "user",
  "isActive": true,
  "createdAt": "2024-05-11T12:00:00.000Z",
  "updatedAt": "2024-05-11T12:00:00.000Z"
}
```

---

### 2. Get All Users (with Pagination)
**GET** `/users?page=1&limit=10`

```bash
curl http://localhost:3000/api/users?page=1&limit=10
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-05-11T12:00:00.000Z",
      "updatedAt": "2024-05-11T12:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1
}
```

---

### 3. Get Single User by ID
**GET** `/users/{id}`

```bash
curl http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "user",
  "isActive": true,
  "createdAt": "2024-05-11T12:00:00.000Z",
  "updatedAt": "2024-05-11T12:00:00.000Z"
}
```

---

### 4. Update User
**PUT** `/users/{id}`

```bash
curl -X PUT http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "email": "jane.doe@example.com"
  }'
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "role": "user",
  "isActive": true,
  "createdAt": "2024-05-11T12:00:00.000Z",
  "updatedAt": "2024-05-11T12:00:01.000Z"
}
```

---

### 5. Delete User
**DELETE** `/users/{id}`

```bash
curl -X DELETE http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Posts Endpoints

### 1. Create a New Post
**POST** `/posts`

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started with NestJS",
    "content": "NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications.",
    "authorId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Response (201 Created):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "title": "Getting Started with NestJS",
  "content": "NestJS is a progressive Node.js framework...",
  "authorId": "550e8400-e29b-41d4-a716-446655440000",
  "isPublished": true,
  "views": 0,
  "createdAt": "2024-05-11T12:05:00.000Z",
  "updatedAt": "2024-05-11T12:05:00.000Z"
}
```

---

### 2. Get All Posts (with Pagination)
**GET** `/posts?page=1&limit=10`

```bash
curl http://localhost:3000/api/posts?page=1&limit=10
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Getting Started with NestJS",
      "content": "NestJS is a progressive Node.js framework...",
      "authorId": "550e8400-e29b-41d4-a716-446655440000",
      "isPublished": true,
      "views": 5,
      "createdAt": "2024-05-11T12:05:00.000Z",
      "updatedAt": "2024-05-11T12:05:00.000Z"
    }
  ],
  "total": 1,
  "page": 1
}
```

---

### 3. Get Single Post by ID
**GET** `/posts/{id}`

Note: Viewing a post increments the view counter.

```bash
curl http://localhost:3000/api/posts/660e8400-e29b-41d4-a716-446655440001
```

**Response (200 OK):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "title": "Getting Started with NestJS",
  "content": "NestJS is a progressive Node.js framework...",
  "authorId": "550e8400-e29b-41d4-a716-446655440000",
  "isPublished": true,
  "views": 6,
  "createdAt": "2024-05-11T12:05:00.000Z",
  "updatedAt": "2024-05-11T12:05:00.000Z"
}
```

---

### 4. Update Post
**PUT** `/posts/{id}`

```bash
curl -X PUT http://localhost:3000/api/posts/660e8400-e29b-41d4-a716-446655440001 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced NestJS Patterns",
    "isPublished": false
  }'
```

**Response (200 OK):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "title": "Advanced NestJS Patterns",
  "content": "NestJS is a progressive Node.js framework...",
  "authorId": "550e8400-e29b-41d4-a716-446655440000",
  "isPublished": false,
  "views": 6,
  "createdAt": "2024-05-11T12:05:00.000Z",
  "updatedAt": "2024-05-11T12:06:00.000Z"
}
```

---

### 5. Delete Post
**DELETE** `/posts/{id}`

```bash
curl -X DELETE http://localhost:3000/api/posts/660e8400-e29b-41d4-a716-446655440001
```

**Response (200 OK):**
```json
{
  "message": "Post deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request (Validation Error)
```json
{
  "statusCode": 400,
  "timestamp": "2024-05-11T12:00:00.000Z",
  "path": "/api/users",
  "method": "POST",
  "message": "Validation failed",
  "errors": [
    {
      "target": {},
      "property": "email",
      "constraints": {
        "isEmail": "email must be an email"
      }
    }
  ]
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "timestamp": "2024-05-11T12:00:00.000Z",
  "path": "/api/users/invalid-id",
  "method": "GET",
  "message": "User not found"
}
```

### 409 Conflict (Duplicate Email)
```json
{
  "statusCode": 409,
  "timestamp": "2024-05-11T12:00:00.000Z",
  "path": "/api/users",
  "method": "POST",
  "message": "User with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "timestamp": "2024-05-11T12:00:00.000Z",
  "path": "/api/users",
  "method": "GET",
  "message": "Internal server error"
}
```

---

## Testing Workflow

### Complete User & Post Creation Flow

```bash
# 1. Create a user
USER_ID=$(curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice@example.com",
    "password": "Password123"
  }' | jq -r '.id')

echo "Created user: $USER_ID"

# 2. Create a post by the user
POST_ID=$(curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"My First Post\",
    \"content\": \"This is my first post on this platform!\",
    \"authorId\": \"$USER_ID\"
  }" | jq -r '.id')

echo "Created post: $POST_ID"

# 3. View the post (increments views)
curl http://localhost:3000/api/posts/$POST_ID | jq '.views'

# 4. Get all posts
curl http://localhost:3000/api/posts?page=1&limit=5 | jq '.data | length'

# 5. Update the post
curl -X PUT http://localhost:3000/api/posts/$POST_ID \
  -H "Content-Type: application/json" \
  -d '{"title": "My Updated Post"}' | jq '.title'

# 6. Delete the post
curl -X DELETE http://localhost:3000/api/posts/$POST_ID | jq '.message'

# 7. Delete the user
curl -X DELETE http://localhost:3000/api/users/$USER_ID | jq '.message'
```

---

## API Response Patterns

All responses follow this pattern:

**Success (2xx):**
```json
{
  "id": "...",
  "data": "...",
  // resource-specific fields
}
```

**Error (4xx/5xx):**
```json
{
  "statusCode": 400,
  "timestamp": "2024-05-11T12:00:00.000Z",
  "path": "/api/endpoint",
  "method": "POST",
  "message": "Error description",
  "errors": [...] // Optional
}
```

---

## Validation Rules

### User Creation
- **firstName**: Required, string
- **lastName**: Required, string
- **email**: Required, must be valid email, unique
- **password**: Required, minimum 6 characters

### User Update
- All fields optional
- Email must be unique if provided

### Post Creation
- **title**: Required, string
- **content**: Required, string
- **authorId**: Required, valid UUID

### Post Update
- **title**: Optional, string
- **content**: Optional, string
- **isPublished**: Optional, boolean

---

## Pro Tips

1. **Pagination**: Always use page and limit for list endpoints
2. **Filtering**: Can be extended with additional query parameters
3. **Sorting**: Can be implemented by extending services
4. **Soft Delete**: Can be added to Track deleted records
5. **Audit Trail**: Capture createdAt and updatedAt automatically

---

**Happy API Testing!**

