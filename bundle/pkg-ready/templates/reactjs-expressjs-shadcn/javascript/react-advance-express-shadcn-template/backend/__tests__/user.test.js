import request from 'supertest';
import app from '../index.js';
import User from '../models/user.model.js';

describe('User API', () => {
  describe('POST /api/v1/users', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.email).toBe(userData.email.toLowerCase());
    });

    it('should return 400 for missing required fields', async () => {
      const userData = {
        name: 'John Doe'
        // email missing
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid email format', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      // Create first user
      await request(app)
        .post('/api/v1/users')
        .send(userData);

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/users', () => {
    beforeEach(async () => {
      // Create test users
      await User.create([
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' },
        { name: 'Bob Johnson', email: 'bob@example.com' }
      ]);
    });

    it('should return all users with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toHaveLength(3);
      expect(response.body.data.pagination.total).toBe(3);
    });

    it('should return paginated results', async () => {
      const response = await request(app)
        .get('/api/v1/users?page=1&limit=2')
        .expect(200);

      expect(response.body.data.users).toHaveLength(2);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(2);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    let userId;

    beforeEach(async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com'
      });
      userId = user._id.toString();
    });

    it('should return a single user by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('John Doe');
      expect(response.body.data.email).toBe('john@example.com');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/v1/users/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    let userId;

    beforeEach(async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com'
      });
      userId = user._id.toString();
    });

    it('should update user with valid data', async () => {
      const updateData = {
        name: 'John Updated',
        email: 'john.updated@example.com'
      };

      const response = await request(app)
        .put(`/api/v1/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe(updateData.email.toLowerCase());
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/v1/users/${fakeId}`)
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    let userId;

    beforeEach(async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com'
      });
      userId = user._id.toString();
    });

    it('should delete user successfully', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify user is deleted
      const deletedUser = await User.findById(userId);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/v1/users/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/users/search', () => {
    beforeEach(async () => {
      await User.create([
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' },
        { name: 'Bob Johnson', email: 'bob@example.com' }
      ]);
    });

    it('should search users by name', async () => {
      const response = await request(app)
        .get('/api/v1/users/search?q=john')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('John Doe');
    });

    it('should search users by email', async () => {
      const response = await request(app)
        .get('/api/v1/users/search?q=jane@example.com')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].email).toBe('jane@example.com');
    });

    it('should return 400 for missing search query', async () => {
      const response = await request(app)
        .get('/api/v1/users/search')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
}); 