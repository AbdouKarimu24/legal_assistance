const request = require('supertest');
const app = require('../../microservices/chat-service/index');

describe('Chat Service Integration', () => {
  let authToken;

  beforeAll(async () => {
    // Mock authentication token
    authToken = 'mock-jwt-token';
  });

  describe('POST /chat', () => {
    it('should send a chat message', async () => {
      const chatData = {
        message: 'Hello, I need legal advice',
        userId: 1
      };

      const response = await request(app)
        .post('/chat')
        .send(chatData)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /chat/history/:userId', () => {
    it('should fetch chat history', async () => {
      const userId = 1;

      const response = await request(app)
        .get(`/chat/history/${userId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});