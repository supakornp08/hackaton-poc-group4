// In-memory document storage (in production, use a database)
export interface StoredDocument {
  id: string;
  title: string;
  fileName: string;
  size: number;
  uploadedAt: string;
  content: string;
  filePath: string;
}

export const documentsStore = new Map<string, StoredDocument>();
