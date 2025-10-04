# Express JavaScript Template

A modern, production-ready Express.js template with JavaScript, featuring comprehensive error handling, security middleware, testing setup, and best practices.

## 🚀 Features

- **Modern JavaScript**: Uses ES modules with proper import/export syntax
- **Security**: Built-in security middleware (Helmet, CORS, Rate Limiting)
- **Error Handling**: Comprehensive error handling with custom error classes
- **Validation**: Request validation middleware
- **Database**: MongoDB with Mongoose ODM
- **Testing**: Jest setup with MongoDB Memory Server
- **Linting**: ESLint with modern JavaScript rules
- **Logging**: Custom logger with different log levels
- **API Documentation**: Well-documented API endpoints
- **Pagination**: Built-in pagination support
- **Search**: Full-text search capabilities
- **Compression**: Response compression for better performance

## 📁 Project Structure

```
├── config/
│   └── database.js          # Database connection configuration
├── controllers/
│   └── user.controller.js   # User CRUD operations
├── middleware/
│   ├── errorHandler.js      # Error handling middleware
│   ├── security.js          # Security middleware (CORS, Helmet, etc.)
│   └── validation.js        # Request validation
├── models/
│   └── user.model.js        # User Mongoose model
├── routes/
│   ├── index.js             # Main routes index
│   └── user.routes.js       # User routes
├── utils/
│   └── logger.js            # Custom logger utility
├── __tests__/
│   ├── setup.js             # Test setup configuration
│   └── user.test.js         # User API tests
├── index.js                 # Main application file
├── package.json             # Dependencies and scripts
├── jest.config.js           # Jest configuration
├── .eslintrc.json          # ESLint configuration
└── env.example             # Environment variables example
```

## 🛠️ Installation

1. **Clone or use the template**
   ```bash
   # If using as a template
   npx create-express-javascript-app my-app
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
| `LOG_LEVEL` | Logging level | `info` |

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

### Production Deployment

1. **Set production environment variables**
   ```env
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=your-production-mongodb-uri
   ```

2. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

## 🔧 Development

### Code Style

The template uses ESLint with modern JavaScript rules:

- **ES2022**: Latest ECMAScript features
- **ES Modules**: Import/export syntax
- **Strict Mode**: Better error catching
- **Consistent Formatting**: Prettier-like rules

### Adding New Features

1. **Create a new model** in `models/`
2. **Add controller logic** in `controllers/`
3. **Define routes** in `routes/`
4. **Add validation** in `middleware/validation.js`
5. **Write tests** in `__tests__/`

### Error Handling

The template includes comprehensive error handling:

- **Custom Error Class**: Extends Error with status codes
- **Async Handler**: Wraps async functions for error catching
- **Global Error Handler**: Catches all unhandled errors
- **Validation Errors**: Proper error messages for invalid data

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