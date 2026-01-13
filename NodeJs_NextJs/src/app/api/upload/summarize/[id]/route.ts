import { NextRequest, NextResponse } from 'next/server';
import { documentsStore } from '@/lib/store';

// AI Service for summarization (mock implementation)
async function generateSummary(content: string, summaryType: string): Promise<string> {
  // In production, call Azure OpenAI or other AI service
  const summaryPrompts: Record<string, string> = {
    general: 'สรุปเนื้อหาโดยรวม',
    bullet: 'สรุปเป็นข้อๆ',
    technical: 'สรุปเชิงเทคนิค',
    executive: 'สรุปสำหรับผู้บริหาร',
  };

  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 1000));

  const preview = content.substring(0, 500);
  
  if (summaryType === 'bullet') {
    return `📋 **สรุปแบบหัวข้อ:**\n\n• จุดสำคัญที่ 1: ${preview.substring(0, 100)}...\n• จุดสำคัญที่ 2: เนื้อหาเกี่ยวกับเอกสารนี้\n• จุดสำคัญที่ 3: ข้อมูลที่น่าสนใจจากเอกสาร`;
  } else if (summaryType === 'technical') {
    return `🔧 **สรุปเชิงเทคนิค:**\n\nเอกสารนี้ประกอบด้วยข้อมูลทางเทคนิคดังนี้:\n\n${preview.substring(0, 200)}...\n\n**รายละเอียดทางเทคนิค:**\n- ขนาดข้อมูล: ${content.length} ตัวอักษร\n- รูปแบบเนื้อหา: Text/Document`;
  } else if (summaryType === 'executive') {
    return `📊 **สรุปสำหรับผู้บริหาร:**\n\n**ภาพรวม:** เอกสารนี้นำเสนอข้อมูลสำคัญที่เกี่ยวข้องกับการดำเนินธุรกิจ\n\n**ประเด็นหลัก:**\n${preview.substring(0, 150)}...\n\n**ข้อเสนอแนะ:** ควรพิจารณาเนื้อหาในเอกสารเพื่อการตัดสินใจที่เหมาะสม`;
  }
  
  return `📝 **สรุปทั่วไป:**\n\n${preview}...\n\n**หมายเหตุ:** นี่คือการสรุปโดย AI จากเนื้อหาในเอกสาร`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json().catch(() => ({}));
    const summaryType = body.summaryType || 'general';

    const doc = documentsStore.get(id);

    if (!doc) {
      return NextResponse.json(
        { success: false, error: 'Document not found', errorCode: 'DOCUMENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const summary = await generateSummary(doc.content, summaryType);

    return NextResponse.json({
      success: true,
      documentId: doc.id,
      fileName: doc.fileName,
      summary,
      summaryType,
    });
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', errorCode: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
