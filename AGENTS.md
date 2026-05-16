# AGENTS.md - NestJS PostgreSQL Scalable API

## Project Overview
Production-ready NestJS API with PostgreSQL, TypeORM, JWT auth, and Swagger documentation. Organized by feature modules with clear separation of concerns.

## Architecture & Data Flow

### Module Structure
Each feature module (e.g., `src/modules/users/`) follows this pattern:
```
module/
├── entities/        # TypeORM database models (@Entity)
├── dto/            # Request/response validation (class-validator decorators)
├── repositories/   # Custom query logic extending TypeORM Repository
├── module.ts       # Registers entity, controller, service in TypeOrmModule
├── controller.ts   # HTTP endpoints (with Swagger @Api decorators)
└── service.ts      # Business logic, error handling, bcrypt hashing
```

**Key Pattern**: Controllers handle HTTP → Services handle business logic → Repositories abstract data access.

### Service Layer Conventions
- Services use `@InjectRepository(Entity)` to access custom repositories
- Always wrap code in try-catch; log errors with `Logger` class
- Throw `HttpException` with specific `HttpStatus` codes
- Map entities to DTOs before returning (e.g., exclude passwords in `mapToResponseDto`)
- Password handling: Hash on create with `bcrypt.hash(password, 10)`, never return

### Repository Extensions
Custom repositories extend `Repository<Entity>` and add domain-specific queries:
```typescript
@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async findUserByEmail(email: string): Promise<User | null> { ... }
}
```

### DTO Validation
Use `class-validator` decorators on DTOs; validation pipe runs globally on all requests:
- `@IsNotEmpty()`, `@IsString()`, `@IsEmail()`, `@MinLength(n)`
- `@IsOptional()` for UpdateDTOs
- Add `@ApiProperty()` for Swagger docs

### Global Infrastructure (src/common/)
- **Filters**: `GlobalExceptionFilter` catches all exceptions, returns consistent JSON with timestamp, method, path
- **Interceptors**: `LoggingInterceptor` logs method, URL, response time; uses RxJS `tap` operator
- **Pipes**: Global `ValidationPipe` validates DTOs on all routes
- Applied in `main.ts` via `app.useGlobal*()` methods

## Developer Workflows

### Build & Run
```bash
npm install --legacy-peer-deps  # Legacy peer deps needed due to dependency conflicts
npm run start:dev               # Watch mode (auto-reload on file changes)
npm run build                   # Compile TypeScript to dist/
npm run start:prod              # Run compiled dist/main.js
npm run start:debug             # Debug mode with inspector
```

### Database Setup
```bash
npm run typeorm:migration:create -- -n MigrationName
npm run typeorm:migration:run
npm run typeorm:migration:revert
```
Migrations stored in `src/database/migrations/`; entities auto-discovered from `src/modules/**/entities/*.entity.ts`

### Validation & Quality
```bash
npm run lint  # ESLint with auto-fix
```

### API Documentation
Swagger available at `http://localhost:3000/api` (auto-generated from controller decorators)

## Key Configuration

**Environment Variables (.env)**:
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` → TypeORM connection
- `NODE_ENV` → Determines `synchronize` and `logging` in TypeORM
- `APP_PORT`, `APP_NAME`, `JWT_SECRET`, `JWT_EXPIRATION` → App config

**TypeORM Config** (`src/config/database.config.ts`):
- Entities auto-discovered: `src/modules/**/entities/*.entity.{ts,js}`
- `synchronize: true` in dev (auto-sync schema), `false` in production
- `logging: true` in dev enables SQL logging

**Security Headers** (`main.ts`):
- Helmet middleware for security headers
- CORS enabled globally
- Global `ValidationPipe` prevents invalid payloads

## Adding New Features

### New Module Template
Use NestJS CLI:
```bash
nest generate module modules/featureName
nest generate controller modules/featureName
nest generate service modules/featureName
```

Then manually:
1. Create `entities/feature.entity.ts` with TypeORM decorators + `@ApiProperty()`
2. Create `dto/feature.dto.ts` with class-validator + `@ApiProperty()`
3. Create `repositories/feature.repository.ts` extending Repository
4. Update module to register entity, controller, service, export service
5. Add controller decorators: `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()`

### Password Security Pattern
Always hash before saving:
```typescript
const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
// Never return in responses; use mapToResponseDto to exclude
```

## Common Pitfalls for AI Agents
- **Don't** return password fields in DTOs; services must call `mapToResponseDto()` or equivalent
- **Don't** skip DTO validation; rely on global `ValidationPipe` and `@Body(ValidationPipe)`
- **Don't** hardcode errors; throw `HttpException` with proper `HttpStatus` codes
- **Don't** forget `@Injectable()` on repositories and custom services
- **Don't** manually manage database connections; rely on `@InjectRepository()` injection
- Services always use try-catch and `Logger` for error tracking
- TypeORM `select: false` column annotation excludes sensitive fields from queries; use `addSelect()` when needed

## Dependency Key Points
- **@nestjs/typeorm** v9.0.0 with **typeorm** v0.3.17 (entity manager constructor pattern required)
- **class-validator** + **class-transformer** v0.5.x for strict DTO validation
- **bcrypt** v5.1.1 for password hashing (salt rounds: 10)
- **@nestjs/swagger** v7.0.0 for API docs auto-generation
- Peer dependency conflicts resolved with `--legacy-peer-deps` flag

## File References for Patterns
- **Module template**: `src/modules/users/` (mirrors `src/modules/posts/`)
- **Service with logging**: `src/modules/users/users.service.ts`
- **Repository custom queries**: `src/modules/users/repositories/user.repository.ts`
- **DTO validation**: `src/modules/users/dto/user.dto.ts`
- **Global error handling**: `src/common/filters/global-exception.filter.ts`
- **App bootstrap**: `src/main.ts` (shows all middleware/pipes/filters setup)

