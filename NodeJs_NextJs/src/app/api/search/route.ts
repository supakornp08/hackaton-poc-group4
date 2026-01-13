import { NextRequest, NextResponse } from 'next/server';
import { documentsStore } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required', errorCode: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Search in documents
    const results = Array.from(documentsStore.values())
      .filter(doc => {
        const searchText = `${doc.title} ${doc.content} ${doc.fileName}`.toLowerCase();
        return searchText.includes(query);
      })
      .map(doc => {
        // Calculate simple relevance score
        const searchText = `${doc.title} ${doc.content}`.toLowerCase();
        const occurrences = (searchText.match(new RegExp(query, 'g')) || []).length;
        
        // Create snippet
        const contentLower = doc.content.toLowerCase();
        const index = contentLower.indexOf(query);
        let snippet = '';
        if (index >= 0) {
          const start = Math.max(0, index - 50);
          const end = Math.min(doc.content.length, index + query.length + 150);
          snippet = (start > 0 ? '...' : '') + doc.content.substring(start, end) + (end < doc.content.length ? '...' : '');
        } else {
          snippet = doc.content.substring(0, 200) + (doc.content.length > 200 ? '...' : '');
        }

        return {
          id: doc.id,
          title: doc.title,
          snippet,
          score: occurrences * 10 + (doc.title.toLowerCase().includes(query) ? 50 : 0),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', errorCode: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
