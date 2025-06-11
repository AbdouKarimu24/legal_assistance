const request = require('supertest');
const app = require('../../microservices/auth-service/index');
const bcrypt = require('bcryptjs');

describe('Authentication Service', () => {
  describe('POST /register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('userId');
    });

    it('should hash the password', async () => {
      const password = 'testpassword';
      const hashed = await bcrypt.hash(password, 10);

      expect(hashed).not.toBe(password);
      expect(await bcrypt.compare(password, hashed)).toBe(true);
    });
  });

  describe('POST /login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });
  });
});