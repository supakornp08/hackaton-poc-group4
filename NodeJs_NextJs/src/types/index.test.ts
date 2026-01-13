import { 
  Document, 
  UploadResponse, 
  SummarizeResponse, 
  DeleteResponse,
  SearchResult,
  SearchResponse,
  ChatMessage 
} from './index';

describe('Type Definitions', () => {
  describe('Document Type', () => {
    it('should create a valid Document', () => {
      const doc: Document = {
        id: 'doc-123',
        title: 'Test Document',
        fileName: 'test.pdf',
        size: 1024,
        uploadedAt: '2026-01-13T10:00:00Z',
      };

      expect(doc.id).toBe('doc-123');
      expect(doc.title).toBe('Test Document');
      expect(doc.fileName).toBe('test.pdf');
      expect(doc.size).toBe(1024);
      expect(doc.uploadedAt).toBe('2026-01-13T10:00:00Z');
    });

    it('should allow optional content field', () => {
      const docWithContent: Document = {
        id: 'doc-1',
        title: 'With Content',
        fileName: 'file.pdf',
        size: 100,
        uploadedAt: '2026-01-13',
        content: 'Document text content',
      };

      const docWithoutContent: Document = {
        id: 'doc-2',
        title: 'Without Content',
        fileName: 'file2.pdf',
        size: 200,
        uploadedAt: '2026-01-13',
      };

      expect(docWithContent.content).toBe('Document text content');
      expect(docWithoutContent.content).toBeUndefined();
    });
  });

  describe('UploadResponse Type', () => {
    it('should create a successful UploadResponse', () => {
      const response: UploadResponse = {
        success: true,
        documents: [
          { id: '1', title: 'Doc 1', fileName: 'doc1.pdf', size: 100, uploadedAt: '2026-01-13' },
        ],
      };

      expect(response.success).toBe(true);
      expect(response.documents.length).toBe(1);
      expect(response.errors).toBeUndefined();
    });

    it('should create an UploadResponse with errors', () => {
      const response: UploadResponse = {
        success: false,
        documents: [],
        errors: ['File too large', 'Invalid format'],
      };

      expect(response.success).toBe(false);
      expect(response.documents.length).toBe(0);
      expect(response.errors?.length).toBe(2);
    });
  });

  describe('SummarizeResponse Type', () => {
    it('should create a valid SummarizeResponse', () => {
      const response: SummarizeResponse = {
        success: true,
        documentId: 'doc-123',
        fileName: 'report.pdf',
        summary: 'This is the document summary...',
        summaryType: 'executive',
      };

      expect(response.success).toBe(true);
      expect(response.documentId).toBe('doc-123');
      expect(response.fileName).toBe('report.pdf');
      expect(response.summary).toContain('summary');
      expect(response.summaryType).toBe('executive');
    });
  });

  describe('DeleteResponse Type', () => {
    it('should create a successful DeleteResponse', () => {
      const response: DeleteResponse = {
        success: true,
      };

      expect(response.success).toBe(true);
    });

    it('should create a failed DeleteResponse', () => {
      const response: DeleteResponse = {
        success: false,
      };

      expect(response.success).toBe(false);
    });
  });

  describe('SearchResult Type', () => {
    it('should create a valid SearchResult', () => {
      const result: SearchResult = {
        id: 'result-1',
        title: 'Search Result',
        snippet: 'This is a snippet of the matched content...',
        score: 0.95,
      };

      expect(result.id).toBe('result-1');
      expect(result.title).toBe('Search Result');
      expect(result.snippet).toContain('snippet');
      expect(result.score).toBe(0.95);
    });
  });

  describe('SearchResponse Type', () => {
    it('should create a successful SearchResponse', () => {
      const response: SearchResponse = {
        success: true,
        results: [
          { id: '1', title: 'Result 1', snippet: 'Snippet 1', score: 0.9 },
          { id: '2', title: 'Result 2', snippet: 'Snippet 2', score: 0.8 },
        ],
      };

      expect(response.success).toBe(true);
      expect(response.results.length).toBe(2);
      expect(response.error).toBeUndefined();
    });

    it('should create a failed SearchResponse with error', () => {
      const response: SearchResponse = {
        success: false,
        results: [],
        error: 'Search service unavailable',
      };

      expect(response.success).toBe(false);
      expect(response.results.length).toBe(0);
      expect(response.error).toBe('Search service unavailable');
    });
  });

  describe('ChatMessage Type', () => {
    it('should create a user ChatMessage', () => {
      const message: ChatMessage = {
        role: 'user',
        content: 'Hello, how can I get a loan?',
        timestamp: new Date(),
      };

      expect(message.role).toBe('user');
      expect(message.content).toContain('loan');
      expect(message.timestamp).toBeInstanceOf(Date);
    });

    it('should create an assistant ChatMessage', () => {
      const message: ChatMessage = {
        role: 'assistant',
        content: 'I can help you with loan information...',
        timestamp: new Date(),
      };

      expect(message.role).toBe('assistant');
      expect(message.content).toContain('loan');
    });

    it('should enforce role constraint', () => {
      const userMessage: ChatMessage = { role: 'user', content: 'Hi', timestamp: new Date() };
      const assistantMessage: ChatMessage = { role: 'assistant', content: 'Hello', timestamp: new Date() };

      // TypeScript would catch invalid roles at compile time
      expect(['user', 'assistant']).toContain(userMessage.role);
      expect(['user', 'assistant']).toContain(assistantMessage.role);
    });
  });

  describe('Type Compatibility', () => {
    it('should allow Document in UploadResponse documents array', () => {
      const doc: Document = {
        id: 'compat-test',
        title: 'Compatibility Test',
        fileName: 'compat.pdf',
        size: 500,
        uploadedAt: '2026-01-13',
      };

      const response: UploadResponse = {
        success: true,
        documents: [doc],
      };

      expect(response.documents[0]).toEqual(doc);
    });

    it('should allow SearchResult in SearchResponse results array', () => {
      const result: SearchResult = {
        id: 'search-compat',
        title: 'Search Compat',
        snippet: 'Testing compatibility',
        score: 0.75,
      };

      const response: SearchResponse = {
        success: true,
        results: [result],
      };

      expect(response.results[0]).toEqual(result);
    });
  });
});
