# Scalable NestJS with PostgreSQL - Quick Start Guide

## Project Overview

This is a **production-ready** NestJS template demonstrating best practices for building scalable and maintainable APIs with PostgreSQL integration. It's designed to serve as a foundation for larger projects.

## What's Included

* Modular Architecture - Clean separation of concerns with feature modules  
* Database Integration - TypeORM with PostgreSQL  
* API Documentation - Swagger/OpenAPI auto-generated docs  
* Security - JWT, Password hashing, CORS, Helmet  
* Validation - Strong type safety and input validation  
* Error Handling - Global exception filters  
* Logging - Request/response logging with timestamps  
* Code Quality - ESLint configuration included  

## Quick Start

### Prerequisites
```bash
Node.js >= 16
PostgreSQL >= 12
npm or yarn
```

### Installation

1. **Install Dependencies**
```bash
npm install --legacy-peer-deps
```

2. **Setup Database**
```bash
# Create a PostgreSQL database first
createdb nest_db
```

3. **Configure Environment**
```bash
# Edit .env file with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nest_db
```

4. **Run Development Server**
```bash
npm run start:dev
```

5. **Access Swagger Docs**
Navigate to: `http://localhost:3000/api`

## Project Structure Explained

```
src/
├── common/                 # Shared utilities
│   ├── filters/           # Global exception handling
│   ├── interceptors/      # Request/response logging
│   └── pipes/             # Custom validation
├── config/                # Environment & DB config
├── database/              # Migrations (future)
├── modules/               # Feature modules
│   ├── users/
│   │   ├── dto/          # Data transfer objects
│   │   ├── entities/     # Database models
│   │   ├── repositories/ # Data access layer
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── users.module.ts
│   └── posts/            # Similar structure
├── app.module.ts         # Root module
└── main.ts              # Entry point
```

## Key Concepts

### DTOs (Data Transfer Objects)
```typescript
// Validates incoming data
export class CreateUserDto {
  @IsEmail()
  email: string;
  
  @MinLength(6)
  password: string;
}
```

### 2. **Repositories**
```typescript
// Encapsulates data access logic
async findUserByEmail(email: string): Promise<User | null>

// Makes business logic testable
async findActiveUsers(): Promise<User[]>
```

### 3. **Services**
```typescript
// Contains business logic
async createUser(dto: CreateUserDto): Promise<UserResponseDto>

// Uses repositories for data access
// Handles errors gracefully
// Logs important operations
```

### 4. **Controllers**
```typescript
// HTTP endpoints only
@Post()
async createUser(@Body() dto: CreateUserDto)

// Uses services for logic
// Handles validation via pipes
// Returns responses to client
```

## Testing the API

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Test123456"
  }'
```

### Get All Users
```bash
curl http://localhost:3000/api/users?page=1&limit=10
```

### Get Single User
```bash
curl http://localhost:3000/api/users/{user-id}
```

### Update User
```bash
curl -X PUT http://localhost:3000/api/users/{user-id} \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "email": "jane@example.com"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/{user-id}
```

## Scaling Your Project

### Adding a New Module

1. **Create folder**: `src/modules/comments`
2. **Create files**:
   - `entities/comment.entity.ts` - Database model
   - `dto/comment.dto.ts` - Input validation
   - `repositories/comment.repository.ts` - Data access
   - `comments.service.ts` - Business logic
   - `comments.controller.ts` - HTTP endpoints
   - `comments.module.ts` - Module definition

3. **Import module** in `app.module.ts`:
```typescript
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
    // ...
    CommentsModule,
  ],
})
export class AppModule {}
```

## Security Best Practices

* Passwords: Hashed with bcrypt (10 rounds)  
* CORS: Configured with helmet  
* Input Validation: All DTOs validated  
* Error Messages: Generic to prevent info disclosure  
* HTTP Headers: Protected by helmet middleware  
* SQL Injection: Protected by TypeORM parameterized queries  

## Database Schema Visualization

```
[Users]                    [Posts]
├─ id (UUID)              ├─ id (UUID)
├─ firstName              ├─ title
├─ lastName               ├─ content
├─ email (unique)         ├─ authorId (FK → Users.id)
├─ password               ├─ isPublished
├─ role                   ├─ views
├─ isActive               ├─ createdAt
├─ createdAt              └─ updatedAt
└─ updatedAt
```

## Code Examples

```bash
npm run build          # Compile TypeScript
npm run start          # Run in production mode
npm run start:dev      # Run with auto-reload
npm run start:debug    # Run in debug mode
npm run lint           # Run ESLint
```

##  Troubleshooting

### Port Already in Use
```bash
# Change port in .env
APP_PORT=3001

# Or kill the process
lsof -i :3000
kill -9 <PID>
```

### Database Connection Failed
```bash
# Verify PostgreSQL is running
psql -U postgres

# Check .env credentials
# Verify database exists
\l
```

### TypeScript Compilation Errors
```bash
# Clear build artifacts
rm -rf dist

# Rebuild
npm run build
```

## Next Steps

1. **Add Authentication**: Implement JWT with `@nestjs/jwt`
2. **Add Testing**: Setup Jest for unit tests
3. **Add Caching**: Integrate Redis for performance
4. **Add Pagination**: Already implemented in controllers
5. **Add Rate Limiting**: Use `nestjs-rate-limit`
6. **Add Logging**: Upgrade to Winston logger
7. **Add Swagger Auth**: Setup bearer token in Swagger

## Resources

- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [PostgreSQL Guide](https://www.postgresql.org/docs)
- [REST API Best Practices](https://restfulapi.net)
- [Swagger/OpenAPI](https://swagger.io)

## Tips

- Always use repositories for data access
- Keep business logic in services
- Controllers should only handle HTTP
- Use DTOs for input validation
- Handle errors with meaningful messages
- Log important operations
- Test business logic separately

## License

MIT - Use this template for any project!

---

**Built with love for scalable applications**

