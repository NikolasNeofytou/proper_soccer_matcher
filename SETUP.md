# Development Setup Guide

## Prerequisites

- Node.js 20+ and npm 10+
- Docker and Docker Compose (for local services)
- Git

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/NikolasNeofytou/proper_soccer_matcher.git
cd proper_soccer_matcher
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` file with your local configuration. For development, the default values should work with the Docker Compose setup.

### 4. Start local services (PostgreSQL, Redis, Elasticsearch)

```bash
docker-compose up -d
```

Wait for all services to be healthy:
```bash
docker-compose ps
```

### 5. Run database migrations

```bash
cd packages/backend
npm run migration:run
```

### 6. Start the backend development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`
API Documentation at `http://localhost:3000/api/docs`

## Project Structure

```
proper-soccer-matcher/
├── packages/
│   ├── backend/           # NestJS API
│   ├── frontend/          # React web app (coming soon)
│   └── mobile/            # React Native app (coming soon)
├── docker-compose.yml     # Local development services
├── .env.example           # Environment variables template
└── package.json           # Root package configuration
```

## Available Scripts

### Root Level

- `npm run dev` - Start backend in development mode
- `npm run build` - Build all packages
- `npm run test` - Run tests in all packages
- `npm run lint` - Lint code in all packages
- `npm run format` - Format code with Prettier

### Backend (packages/backend)

- `npm run dev` - Start with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run e2e tests
- `npm run migration:generate` - Generate new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration

## Database Setup

The application uses PostgreSQL as the primary database. TypeORM handles migrations and schema synchronization.

### Creating a new migration

```bash
cd packages/backend
npm run migration:generate -- src/migrations/YourMigrationName
npm run migration:run
```

### Resetting the database

```bash
docker-compose down -v
docker-compose up -d
npm run migration:run
```

## Testing

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
cd packages/backend
npm run test:watch
```

### Run tests with coverage

```bash
npm run test:cov
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:3000/api/docs`

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login

#### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID

## Troubleshooting

### Port already in use

If you get port conflicts, you can change the ports in `docker-compose.yml`:

```yaml
ports:
  - '5433:5432'  # Change 5432 to 5433 for PostgreSQL
```

Also update the `.env` file:
```
DATABASE_PORT=5433
```

### Database connection errors

1. Ensure Docker services are running:
   ```bash
   docker-compose ps
   ```

2. Check service logs:
   ```bash
   docker-compose logs postgres
   ```

3. Restart services:
   ```bash
   docker-compose restart
   ```

### TypeORM sync errors

If you're experiencing schema sync issues, you can temporarily enable `synchronize`:

```typescript
// In app.module.ts
synchronize: true  // Only for development!
```

**Warning**: Never use `synchronize: true` in production!

## Environment Variables

Key environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/proper_soccer_matcher

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
NODE_ENV=development
PORT=3000
```

See `.env.example` for complete list.

## Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test locally

3. Run linting and tests:
   ```bash
   npm run lint
   npm test
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. Push and create a pull request

## Docker Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose stop
```

### Remove services and volumes
```bash
docker-compose down -v
```

### View logs
```bash
docker-compose logs -f [service-name]
```

### Access PostgreSQL
```bash
docker exec -it proper-soccer-db psql -U user -d proper_soccer_matcher
```

### Access Redis
```bash
docker exec -it proper-soccer-redis redis-cli
```

## Next Steps

- [ ] Set up frontend React application
- [ ] Set up React Native mobile app
- [ ] Add more endpoints (pitches, bookings, matches)
- [ ] Implement payment integration (Stripe)
- [ ] Add WebSocket support for real-time features
- [ ] Set up CI/CD pipeline

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Project Documentation](./PROJECT_PLAN.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Architecture Guide](./ARCHITECTURE.md)

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Contact the development team

---

**Happy coding! ⚽**
