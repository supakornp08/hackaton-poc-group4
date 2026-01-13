import { POST } from './route';
import { NextRequest } from 'next/server';

// Helper to create mock NextRequest
function createMockRequest(body: object): NextRequest {
  return {
    json: () => Promise.resolve(body),
  } as unknown as NextRequest;
}

describe('Chat Ask API Route', () => {
  describe('POST /api/chat/ask', () => {
    it('should return 400 when question is missing', async () => {
      const request = createMockRequest({});
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when question is empty string', async () => {
      const request = createMockRequest({ question: '' });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 when question is whitespace only', async () => {
      const request = createMockRequest({ question: '   ' });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 when question is not a string', async () => {
      const request = createMockRequest({ question: 123 });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
    });

    it('should return successful response for loan question', async () => {
      const request = createMockRequest({ question: 'สินเชื่อส่งออก' });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.answer).toContain('สินเชื่อ');
      expect(data.timestamp).toBeDefined();
    });

    it('should return successful response for exchange rate question', async () => {
      const request = createMockRequest({ question: 'อัตราแลกเปลี่ยน' });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.answer).toContain('อัตราแลกเปลี่ยน');
    });

    it('should return successful response for registration question', async () => {
      const request = createMockRequest({ question: 'เปิดบัญชี' });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.answer).toContain('เปิดบัญชี');
    });

    it('should return default response for unknown question', async () => {
      const request = createMockRequest({ question: 'Random question here' });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.answer).toContain('Random question here');
    });

    it('should include context in default response when provided', async () => {
      const request = createMockRequest({ 
        question: 'Unknown question', 
        context: 'Important context' 
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.answer).toContain('Important context');
    });

    it('should include timestamp in response', async () => {
      const request = createMockRequest({ question: 'Test question' });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(data.timestamp).toBeDefined();
      expect(new Date(data.timestamp)).toBeInstanceOf(Date);
    });

    it('should include summary in response', async () => {
      const request = createMockRequest({ question: 'สินเชื่อ' });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(data.summary).toBeDefined();
    });

    it('should handle JSON parse errors gracefully', async () => {
      const request = {
        json: () => Promise.reject(new Error('Invalid JSON')),
      } as unknown as NextRequest;
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.errorCode).toBe('SERVER_ERROR');
    });
  });
});
