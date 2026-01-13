import { documentsStore, StoredDocument } from './store';

describe('Documents Store', () => {
  beforeEach(() => {
    // Clear the store before each test
    documentsStore.clear();
  });

  describe('Basic Operations', () => {
    it('should be empty initially', () => {
      expect(documentsStore.size).toBe(0);
    });

    it('should add a document', () => {
      const doc: StoredDocument = {
        id: 'test-id',
        title: 'Test Document',
        fileName: 'test.pdf',
        size: 1024,
        uploadedAt: new Date().toISOString(),
        content: 'Test content',
        filePath: '/uploads/test.pdf',
      };

      documentsStore.set(doc.id, doc);

      expect(documentsStore.size).toBe(1);
      expect(documentsStore.has('test-id')).toBe(true);
    });

    it('should retrieve a document by id', () => {
      const doc: StoredDocument = {
        id: 'doc-123',
        title: 'My Document',
        fileName: 'file.pdf',
        size: 2048,
        uploadedAt: new Date().toISOString(),
        content: 'Document content here',
        filePath: '/uploads/file.pdf',
      };

      documentsStore.set(doc.id, doc);
      const retrieved = documentsStore.get('doc-123');

      expect(retrieved).toBeDefined();
      expect(retrieved?.title).toBe('My Document');
      expect(retrieved?.fileName).toBe('file.pdf');
    });

    it('should return undefined for non-existent document', () => {
      const retrieved = documentsStore.get('non-existent');
      expect(retrieved).toBeUndefined();
    });

    it('should delete a document', () => {
      const doc: StoredDocument = {
        id: 'to-delete',
        title: 'Delete Me',
        fileName: 'delete.pdf',
        size: 512,
        uploadedAt: new Date().toISOString(),
        content: 'Content to delete',
        filePath: '/uploads/delete.pdf',
      };

      documentsStore.set(doc.id, doc);
      expect(documentsStore.has('to-delete')).toBe(true);

      documentsStore.delete('to-delete');
      expect(documentsStore.has('to-delete')).toBe(false);
    });

    it('should update a document', () => {
      const doc: StoredDocument = {
        id: 'update-id',
        title: 'Original Title',
        fileName: 'original.pdf',
        size: 1024,
        uploadedAt: new Date().toISOString(),
        content: 'Original content',
        filePath: '/uploads/original.pdf',
      };

      documentsStore.set(doc.id, doc);

      const updatedDoc: StoredDocument = {
        ...doc,
        title: 'Updated Title',
        content: 'Updated content',
      };

      documentsStore.set(doc.id, updatedDoc);

      const retrieved = documentsStore.get('update-id');
      expect(retrieved?.title).toBe('Updated Title');
      expect(retrieved?.content).toBe('Updated content');
    });
  });

  describe('Multiple Documents', () => {
    it('should store multiple documents', () => {
      const docs: StoredDocument[] = [
        {
          id: 'doc-1',
          title: 'Document 1',
          fileName: 'doc1.pdf',
          size: 100,
          uploadedAt: new Date().toISOString(),
          content: 'Content 1',
          filePath: '/uploads/doc1.pdf',
        },
        {
          id: 'doc-2',
          title: 'Document 2',
          fileName: 'doc2.pdf',
          size: 200,
          uploadedAt: new Date().toISOString(),
          content: 'Content 2',
          filePath: '/uploads/doc2.pdf',
        },
        {
          id: 'doc-3',
          title: 'Document 3',
          fileName: 'doc3.pdf',
          size: 300,
          uploadedAt: new Date().toISOString(),
          content: 'Content 3',
          filePath: '/uploads/doc3.pdf',
        },
      ];

      docs.forEach(doc => documentsStore.set(doc.id, doc));

      expect(documentsStore.size).toBe(3);
    });

    it('should iterate over all documents', () => {
      const doc1: StoredDocument = {
        id: 'iter-1',
        title: 'Doc 1',
        fileName: 'iter1.pdf',
        size: 100,
        uploadedAt: new Date().toISOString(),
        content: 'Content',
        filePath: '/uploads/iter1.pdf',
      };

      const doc2: StoredDocument = {
        id: 'iter-2',
        title: 'Doc 2',
        fileName: 'iter2.pdf',
        size: 200,
        uploadedAt: new Date().toISOString(),
        content: 'Content',
        filePath: '/uploads/iter2.pdf',
      };

      documentsStore.set(doc1.id, doc1);
      documentsStore.set(doc2.id, doc2);

      const ids: string[] = [];
      documentsStore.forEach((_, key) => ids.push(key));

      expect(ids).toContain('iter-1');
      expect(ids).toContain('iter-2');
    });

    it('should get all values', () => {
      const doc: StoredDocument = {
        id: 'values-test',
        title: 'Values Test',
        fileName: 'values.pdf',
        size: 100,
        uploadedAt: new Date().toISOString(),
        content: 'Content',
        filePath: '/uploads/values.pdf',
      };

      documentsStore.set(doc.id, doc);

      const values = Array.from(documentsStore.values());
      expect(values.length).toBe(1);
      expect(values[0].title).toBe('Values Test');
    });

    it('should get all keys', () => {
      const doc: StoredDocument = {
        id: 'keys-test',
        title: 'Keys Test',
        fileName: 'keys.pdf',
        size: 100,
        uploadedAt: new Date().toISOString(),
        content: 'Content',
        filePath: '/uploads/keys.pdf',
      };

      documentsStore.set(doc.id, doc);

      const keys = Array.from(documentsStore.keys());
      expect(keys).toContain('keys-test');
    });
  });

  describe('StoredDocument Interface', () => {
    it('should enforce required fields', () => {
      const doc: StoredDocument = {
        id: 'interface-test',
        title: 'Test',
        fileName: 'test.pdf',
        size: 1024,
        uploadedAt: new Date().toISOString(),
        content: 'Content',
        filePath: '/path/to/file',
      };

      // All required fields should be present
      expect(doc.id).toBeDefined();
      expect(doc.title).toBeDefined();
      expect(doc.fileName).toBeDefined();
      expect(doc.size).toBeDefined();
      expect(doc.uploadedAt).toBeDefined();
      expect(doc.content).toBeDefined();
      expect(doc.filePath).toBeDefined();
    });

    it('should handle numeric size correctly', () => {
      const doc: StoredDocument = {
        id: 'size-test',
        title: 'Size Test',
        fileName: 'large.pdf',
        size: 10485760, // 10MB
        uploadedAt: new Date().toISOString(),
        content: 'Large content',
        filePath: '/uploads/large.pdf',
      };

      documentsStore.set(doc.id, doc);
      const retrieved = documentsStore.get('size-test');

      expect(retrieved?.size).toBe(10485760);
      expect(typeof retrieved?.size).toBe('number');
    });

    it('should handle ISO date strings', () => {
      const uploadDate = '2026-01-13T10:30:00.000Z';
      const doc: StoredDocument = {
        id: 'date-test',
        title: 'Date Test',
        fileName: 'date.pdf',
        size: 100,
        uploadedAt: uploadDate,
        content: 'Content',
        filePath: '/uploads/date.pdf',
      };

      documentsStore.set(doc.id, doc);
      const retrieved = documentsStore.get('date-test');

      expect(retrieved?.uploadedAt).toBe(uploadDate);
      expect(new Date(retrieved!.uploadedAt)).toBeInstanceOf(Date);
    });
  });
});
