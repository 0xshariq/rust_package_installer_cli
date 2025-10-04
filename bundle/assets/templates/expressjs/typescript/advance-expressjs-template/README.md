# Express TypeScript Template

A modern, production-ready Express.js template with TypeScript, featuring comprehensive error handling, security middleware, testing setup, and best practices.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Modern ES Modules**: Uses ES modules with proper import/export syntax
- **Security**: Built-in security middleware (Helmet, CORS, Rate Limiting)
- **Error Handling**: Comprehensive error handling with custom error classes
- **Validation**: Request validation middleware
- **Database**: MongoDB with Mongoose ODM
- **Testing**: Jest setup with MongoDB Memory Server
- **Linting**: ESLint with TypeScript rules
- **Logging**: Custom logger with different log levels
- **API Documentation**: Well-documented API endpoints
- **Pagination**: Built-in pagination support
- **Search**: Full-text search capabilities
- **Compression**: Response compression for better performance

## 📁 Project Structure

```
src/
├── config/
│   └── database.ts          # Database connection configuration
├── controllers/
│   └── user.controller.ts   # User CRUD operations
├── middleware/
│   ├── errorHandler.ts      # Error handling middleware
│   ├── security.ts          # Security middleware (CORS, Helmet, etc.)
│   └── validation.ts        # Request validation
├── models/
│   └── user.model.ts        # User Mongoose model
├── routes/
│   ├── index.ts             # Main routes index
│   └── user.routes.ts       # User routes
├── types/
│   └── index.ts             # TypeScript type definitions
├── utils/
│   └── logger.ts            # Custom logger utility
├── __tests__/
│   ├── setup.ts             # Test setup configuration
│   └── user.test.ts         # User API tests
└── index.ts                 # Main application file
```

## 🛠️ Installation

1. **Clone or use the template**
   ```bash
   # If using as a template
   npx create-express-typescript-app my-app
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/your-database
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT secret key | Optional |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `CORS_ORIGIN` | CORS origin | `http://localhost:3000` |

### TypeScript Configuration

The template uses strict TypeScript configuration with:
- ES2022 target
- ESNext modules
- Strict type checking
- Source maps for debugging
- Declaration files generation

## 🗄️ Database

The template uses MongoDB with Mongoose. The User model includes:

- **Validation**: Email format, required fields, length constraints
- **Indexes**: Email and creation date indexes for performance
- **Virtuals**: Computed properties
- **Methods**: Static and instance methods
- **Hooks**: Pre-save middleware for data normalization

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting
- **Input Validation**: Request data validation
- **Error Handling**: Secure error responses
- **Compression**: Response compression

## 🧪 Testing

The template includes a comprehensive testing setup:

- **Jest**: Testing framework
- **Supertest**: HTTP testing
- **MongoDB Memory Server**: In-memory database for tests
- **Test Coverage**: Coverage reporting

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints

#### Health Check
```
GET /health
```

#### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/users` | Create a new user |
| `GET` | `/users` | Get all users (paginated) |
| `GET` | `/users/:id` | Get user by ID |
| `PUT` | `/users/:id` | Update user |
| `DELETE` | `/users/:id` | Delete user |
| `GET` | `/users/search?q=query` | Search users |

### Request/Response Examples

#### Create User
```bash
POST /api/v1/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get Users (Paginated)
```bash
GET /api/v1/users?page=1&limit=10
```

Response:
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

## 🚀 Deployment

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=your-production-mongodb-uri
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests and linting
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy Coding! 🎉** 