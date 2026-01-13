import { NextRequest, NextResponse } from 'next/server';
import { documentsStore } from '@/lib/store';
import { unlink } from 'fs/promises';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const doc = documentsStore.get(id);

    if (!doc) {
      return NextResponse.json(
        { success: false, error: 'Document not found', errorCode: 'DOCUMENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete file from disk
    try {
      await unlink(doc.filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    // Remove from store
    documentsStore.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', errorCode: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const doc = documentsStore.get(id);

    if (!doc) {
      return NextResponse.json(
        { success: false, error: 'Document not found', errorCode: 'DOCUMENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      document: {
        id: doc.id,
        title: doc.title,
        fileName: doc.fileName,
        size: doc.size,
        uploadedAt: doc.uploadedAt,
      },
    });
  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', errorCode: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
