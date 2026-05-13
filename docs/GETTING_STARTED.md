# Start Here - Project Setup & Deployment Guide

Complete guide to setting up, running, and deploying the NestJS scalable architecture.

## Quick Setup (5 minutes)

### Option 1: Local Setup

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Setup PostgreSQL database
createdb nest_db

# 3. Configure environment (if different from default)
# Edit .env file

# 4. Start development server
npm run start:dev

# 5. Access API
# Browse to: http://localhost:3000/api
```

### Option 2: Docker Setup (Recommended)

```bash
# One command to start everything
docker-compose up

# The app will be available at: http://localhost:3000/api
# Database: localhost:5432
```

---

## Project Features Checklist

* Modular Architecture - Each module is self-contained  
* TypeORM Integration - Full database ORM support  
* PostgreSQL - Production-grade database  
* Data Validation - DTOs with class-validator  
* Swagger Docs - Auto-generated API documentation  
* Global Error Handling - Consistent error responses  
* Request Logging - Automatic request/response logging  
* Security - CORS, Helmet, Password hashing  
* Pagination - Built-in list pagination  
* Dynamic Configuration - Environment-based config  

---

## Understanding the Structure

```
nest/
├── src/
│   ├── common/                  # Shared code (filters, pipes, interceptors)
│   ├── config/                  # Configuration (app, database)
│   ├── database/                # Database migrations (future)
│   ├── modules/                 # Feature modules
│   │   ├── users/              # User feature
│   │   │   ├── dto/            # User input/output models
│   │   │   ├── entities/       # Database models
│   │   │   ├── repositories/   # Data access layer
│   │   │   ├── users.service.ts        # Business logic
│   │   │   ├── users.controller.ts     # HTTP endpoints
│   │   │   └── users.module.ts         # Module definition
│   │   └── posts/              # Post feature (same structure)
│   ├── app.module.ts           # Root module
│   └── main.ts                 # Entry point
├── dist/                       # Compiled JavaScript
├── node_modules/               # Dependencies
├── .env                        # Environment variables
├── .env.example                # Environment template
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config
├── README.md                   # Project overview
├── TUTORIAL.md                 # Learning guide
├── API_EXAMPLES.md             # API usage examples
└── docker-compose.yml          # Docker setup

```

---

## How to Add a New Feature Module

Example: Adding a "Categories" module

### Step 1: Create Folder Structure

```bash
mkdir -p src/modules/categories/{dto,entities,repositories}
```

### Step 2: Create Entity

**src/modules/categories/entities/category.entity.ts**
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
```

### Step 3: Create DTOs

**src/modules/categories/dto/category.dto.ts**
```typescript
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

### Step 4: Create Repository

**src/modules/categories/repositories/category.repository.ts**
```typescript
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async findByName(name: string): Promise<Category | null> {
    return this.findOne({ where: { name } });
  }
}
```

### Step 5: Create Service

**src/modules/categories/categories.service.ts**
```typescript
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: CategoryRepository,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepository.findByName(dto.name);
    if (existing) {
      throw new HttpException('Category already exists', HttpStatus.CONFLICT);
    }
    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async delete(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
```

### Step 6: Create Controller

**src/modules/categories/categories.controller.ts**
```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@ApiTags('Categories')
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.categoriesService.delete(id);
    return { message: 'Category deleted' };
  }
}
```

### Step 7: Create Module

**src/modules/categories/categories.module.ts**
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
```

### Step 8: Register Module in App

**src/app.module.ts** (Update)
```typescript
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({...}),
    TypeOrmModule.forRootAsync({...}),
    UsersModule,
    PostsModule,
    CategoriesModule,  // Add this line
  ],
})
export class AppModule {}
```

### Step 9: Rebuild and Test

```bash
npm run build
npm run start:dev

# Test your new endpoints
curl http://localhost:3000/api/categories
```

---

## Development Workflow

### Make Changes to Code
```bash
# Changes auto-reload with npm run start:dev
# No need to restart
```

### Build for Production
```bash
npm run build
```

### Run Production Build Locally
```bash
npm run start:prod
```

### Check Code Quality
```bash
npm run lint
```

---

## Database Migration Guide

### Create New Entity
```typescript
// src/modules/example/entities/example.entity.ts
@Entity('examples')
export class Example {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;
}
```

### Auto-Sync (Development)
TypeORM automatically syncs entities in development mode. Just:
1. Create entity
2. Restart server
3. Database tables created automatically

### Manual Migrations (Production)
```bash
# Create migration
npm run typeorm:migration:create -- -n CreateExampleTable

# Run migrations
npm run typeorm:migration:run

# Revert migrations
npm run typeorm:migration:revert
```

---

## Database Design Tips

### 1. Use UUIDs for Primary Keys
```typescript
@PrimaryGeneratedColumn('uuid')
id!: string;
```

### 2. Always Track Creation Time
```typescript
@CreateDateColumn()
createdAt!: Date;
```

### 3. Track Updates
```typescript
@UpdateDateColumn()
updatedAt!: Date;
```

### 4. Avoid Circular Dependencies
- Keep relationships one-directional when possible
- Use `relations: ['field']` in queries

### 5. Index Frequently Queried Fields
```typescript
@Column({ type: 'varchar', length: 255, unique: true })
email!: string;

@Column({ type: 'integer' })
@Index()
viewCount!: number;
```

---

## Security Checklist

* Change JWT_SECRET in production  
* Use strong database passwords  
* Enable CORS only for required origins  
* Always validate input with DTOs  
* Hash passwords (already implemented)  
* Use HTTPS in production  
* Keep dependencies updated  
* Implement rate limiting  
* Use environment variables for secrets  
* Implement authentication guards  

---

## Optimization Tips

### 1. Add Caching
```bash
npm install @nestjs/cache-manager cache-manager
```

### 2. Add Rate Limiting
```bash
npm install @nestjs/throttler
```

### 3. Add Database Indexing
```typescript
@Index()
@Column()
field: string;
```

### 4. Use Query Pagination
Already implemented - use `?page=1&limit=10`

### 5. Add Async Queues
```bash
npm install bullmq
```

---

## Debugging

### Enable Debug Logging
```typescript
// In main.ts
app.useLogger(['debug']);
```

### Check Database Logs
```typescript
// In database.config.ts
logging: process.env.NODE_ENV === 'development'
```

### Use Chrome DevTools
```bash
npm run start:debug
# Open: chrome://inspect
```

---

## Deployment Strategies

### Option 1: Docker (Recommended)
```bash
docker-compose up -d
```

### Option 2: Traditional Server
```bash
npm install --legacy-peer-deps
npm run build
npm run start:prod
```

### Option 3: Railway/Vercel
See Railway or Vercel docs for Node.js deployment

### Option 4: AWS/Azure/GCP
Follow cloud provider's Node.js deployment guide

---

## Pre-Launch Checklist

- [ ] Change JWT_SECRET
- [ ] Configure .env for production
- [ ] Setup PostgreSQL backup
- [ ] Enable HTTPS
- [ ] Setup monitoring/logging
- [ ] Create database migrations
- [ ] Test all endpoints
- [ ] Load test the API
- [ ] Setup error tracking (Sentry)
- [ ] Document API changes

## Learning Path

##  Learning Path

1. **Week 1**: Understand the project structure
2. **Week 2**: Add a new module following the pattern
3. **Week 3**: Add database relationships
4. **Week 4**: Implement authentication
5. **Week 5**: Deploy to production

---

## Troubleshooting

### Port 3000 Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### PostgreSQL Connection Failed
```bash
# Check if PostgreSQL is running
psql -U postgres

# Verify .env credentials
cat .env
```

### Module Not Found Errors
```bash
# Clear and rebuild
rm -rf dist node_modules
npm install --legacy-peer-deps
npm run build
```

### TypeScript Errors
```bash
# Update TypeScript
npm install typescript@latest --save-dev
npm run build
```

---

**You're all set! Happy coding! **

