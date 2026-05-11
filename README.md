# NestJS Scalable Architecture with PostgreSQL

A production-ready, scalable, and maintainable NestJS API with PostgreSQL integration following industry best practices.

## Features

- **Modular Architecture**: Organized by feature modules (Users, Posts, etc.)
- **Database Integration**: PostgreSQL with TypeORM
- **Type Safety**: Full TypeScript support with strict typing
- **API Documentation**: Swagger/OpenAPI integration
- **Security**: JWT authentication, Password hashing with bcrypt, CORS, Helmet
- **Validation**: Class-validator and class-transformer for DTO validation
- **Error Handling**: Global exception filters and error handling
- **Logging**: Integrated logging interceptors
- **Code Quality**: ESLint and TypeScript strict mode
- **Environment Configuration**: Environment-based configuration management

## Project Structure

```
src/
├── common/                  # Shared utilities
│   ├── decorators/         # Custom decorators
│   ├── filters/            # Global exception filters
│   ├── guards/             # Authentication guards
│   ├── interceptors/       # Global interceptors
│   ├── middleware/         # Custom middleware
│   └── pipes/              # Custom pipes & validation
├── config/                 # Configuration files
│   ├── app.config.ts      # Application configuration
│   └── database.config.ts # Database configuration
├── database/              # Database related files
│   └── migrations/        # Database migrations
├── modules/               # Feature modules
│   ├── users/            # Users module
│   │   ├── dto/          # Data transfer objects
│   │   ├── entities/     # Database entities
│   │   ├── repositories/ # Data repositories
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   └── posts/            # Posts module
│       ├── dto/
│       ├── entities/
│       ├── repositories/
│       ├── posts.controller.ts
│       ├── posts.service.ts
│       └── posts.module.ts
├── app.module.ts         # Root application module
└── main.ts              # Application entry point
```

## Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

### 1. Clone and Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nest_db

# Application
NODE_ENV=development
APP_PORT=3000
APP_NAME=NestJS API

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=24h
```

### 3. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE nest_db;
```

### 4. Run the Application

```bash
# Development mode (with auto-reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

## API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3000/api
```

## Available Endpoints

### Users Module

- **POST** `/api/users` - Create a new user
- **GET** `/api/users` - Get all users (with pagination)
- **GET** `/api/users/:id` - Get user by ID
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

### Posts Module

- **POST** `/api/posts` - Create a new post
- **GET** `/api/posts` - Get all posts (with pagination)
- **GET** `/api/posts/:id` - Get post by ID
- **PUT** `/api/posts/:id` - Update post
- **DELETE** `/api/posts/:id` - Delete post

## Example Usage

### Create a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a Post

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is my first post content",
    "authorId": "user-uuid-here"
  }'
```

### Get All Users

```bash
curl http://localhost:3000/api/users?page=1&limit=10
```

## Architecture Patterns

### Repository Pattern
Data access is abstracted through repository classes, making it easier to change data sources or implement custom queries.

### Service Layer
Business logic is encapsulated in services, keeping controllers clean and focused on HTTP handling.

### DTO Pattern
Data Transfer Objects validate and transform incoming data, ensuring type safety and security.

### Module Pattern
Features are organized into self-contained modules, promoting code organization and reusability.

## Security Features

- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **JWT Authentication**: Bearer token authentication (ready to implement)
- **CORS Protection**: Configurable CORS headers
- **Helmet**: Security headers protection
- **Input Validation**: Strict DTO validation on all inputs
- **Error Messages**: Generic error messages to prevent information disclosure

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  authorId UUID NOT NULL,
  isPublished BOOLEAN DEFAULT true,
  views INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES users(id)
);
```

## Scaling Considerations

1. **Caching**: Add Redis for session and response caching
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **Database Optimization**: Add indexes for frequently queried columns
4. **Load Balancing**: Deploy multiple instances with load balancing
5. **Microservices**: Break down into microservices as needed
6. **Message Queues**: Use Bull or RabbitMQ for async tasks
7. **Monitoring**: Integrate with monitoring tools like Prometheus and Grafana

## Testing (Ready to Implement)

```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:cov      # Generate coverage report
```

## Database Migrations

```bash
# Create a new migration
npm run typeorm:migration:create -- -n MigrationName

# Run migrations
npm run typeorm:migration:run

# Revert last migration
npm run typeorm:migration:revert
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `ps aux | grep postgres`
- Check connection credentials in `.env`
- Ensure database exists: `psql -l`

### TypeORM Sync Issues
- Clear `dist` folder: `rm -rf dist`
- Rebuild: `npm run build`

### Port Already in Use
- Change `APP_PORT` in `.env` file
- Or kill process: `lsof -i :3000` and `kill -9 <PID>`

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Jest Testing](https://jestjs.io)
- [OpenAPI/Swagger](https://swagger.io)

## License

MIT License - feel free to use this project as a template

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and questions, please use the GitHub issues section.

---

**Happy Coding!**

