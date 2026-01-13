import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { documentsStore } from '@/lib/store';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');

export async function POST(request: NextRequest) {
  try {
    // Ensure uploads directory exists
    await mkdir(uploadsDir, { recursive: true });

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files uploaded', errorCode: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const documents = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const fileId = uuidv4();
        const fileName = file.name;
        const filePath = path.join(uploadsDir, `${fileId}_${fileName}`);

        // Save file
        await writeFile(filePath, buffer);

        // Extract text content (simplified - in production use proper extractors)
        let content = '';
        if (fileName.endsWith('.txt')) {
          content = buffer.toString('utf-8');
        } else if (fileName.endsWith('.md')) {
          content = buffer.toString('utf-8');
        } else {
          content = `File content from: ${fileName}`;
        }

        const doc = {
          id: fileId,
          title: fileName.replace(/\.[^/.]+$/, ''),
          fileName: fileName,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          content: content,
          filePath: filePath,
        };

        // Store in memory
        documentsStore.set(fileId, doc);

        documents.push({
          id: doc.id,
          title: doc.title,
          fileName: doc.fileName,
          size: doc.size,
          uploadedAt: doc.uploadedAt,
        });
      } catch (err) {
        errors.push(`${file.name}: ${err instanceof Error ? err.message : 'Upload failed'}`);
      }
    }

    return NextResponse.json({
      success: documents.length > 0,
      documents,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', errorCode: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const documents = Array.from(documentsStore.values()).map(doc => ({
      id: doc.id,
      title: doc.title,
      fileName: doc.fileName,
      size: doc.size,
      uploadedAt: doc.uploadedAt,
    }));

    return NextResponse.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', errorCode: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
