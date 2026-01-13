import { NextRequest, NextResponse } from 'next/server';

// AI Chat Service (mock implementation - in production use Azure OpenAI)
async function askAI(question: string, context?: string): Promise<{ answer: string; summary?: string }> {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 800));

  // Simple response generation
  const lowerQuestion = question.toLowerCase();
  
  // Banking related responses
  if (lowerQuestion.includes('สินเชื่อ') || lowerQuestion.includes('loan')) {
    return {
      answer: `💰 **บริการสินเชื่อ EXIM Bank**\n\nธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย (EXIM Bank) ให้บริการสินเชื่อหลากหลายรูปแบบ:\n\n1. **สินเชื่อส่งออก** - สนับสนุนผู้ส่งออกไทย\n2. **สินเชื่อนำเข้า** - เพื่อการนำเข้าวัตถุดิบและเครื่องจักร\n3. **L/C และ Trust Receipt** - บริการค้ำประกัน\n\nสนใจสอบถามข้อมูลเพิ่มเติมได้ที่ Call Center: 0 2271 3700`,
      summary: 'ข้อมูลบริการสินเชื่อ EXIM Bank',
    };
  }
  
  if (lowerQuestion.includes('อัตราแลกเปลี่ยน') || lowerQuestion.includes('exchange')) {
    return {
      answer: `💱 **อัตราแลกเปลี่ยนเงินตราต่างประเทศ**\n\nสามารถตรวจสอบอัตราแลกเปลี่ยนได้จาก:\n\n• หน้า Dashboard - กราฟอัตราแลกเปลี่ยนแบบ Real-time\n• TradingView Widget - ข้อมูลตลาดการเงิน\n• ธนาคารแห่งประเทศไทย - อัตราอ้างอิง\n\n**คู่สกุลเงินยอดนิยม:**\n- USD/THB\n- EUR/THB\n- JPY/THB\n- GBP/THB`,
      summary: 'ข้อมูลอัตราแลกเปลี่ยน',
    };
  }
  
  if (lowerQuestion.includes('เปิดบัญชี') || lowerQuestion.includes('สมัคร') || lowerQuestion.includes('register')) {
    return {
      answer: `📝 **การเปิดบัญชี/สมัครใช้บริการ**\n\nคุณสามารถสมัครใช้บริการได้ผ่าน:\n\n1. **Smart Form** - กรอกข้อมูลอัตโนมัติด้วย AI\n   - อัพโหลดรูปบัตรประชาชน\n   - ระบบจะกรอกข้อมูลให้อัตโนมัติ\n\n2. **เอกสารที่ต้องเตรียม:**\n   - บัตรประชาชน\n   - ทะเบียนบ้าน\n   - หนังสือรับรองบริษัท (กรณีนิติบุคคล)\n\nไปที่เมนู "ลงทะเบียน" เพื่อเริ่มต้นใช้งาน`,
      summary: 'ขั้นตอนการสมัครใช้บริการ',
    };
  }

  // Default response
  return {
    answer: `🤖 **ขอบคุณสำหรับคำถาม**\n\nคำถามของคุณ: "${question}"\n\n${context ? `**บริบท:** ${context}\n\n` : ''}ฉันคือผู้ช่วย AI ของ EXIM Bank พร้อมให้บริการตอบคำถามเกี่ยวกับ:\n\n• บริการสินเชื่อส่งออก-นำเข้า\n• อัตราแลกเปลี่ยนเงินตราต่างประเทศ\n• บริการ L/C และ Trust Receipt\n• การประกันการส่งออก\n• ขั้นตอนการสมัครใช้บริการ\n\nโปรดระบุหัวข้อที่ต้องการทราบเพิ่มเติมครับ`,
    summary: 'คำตอบจาก AI Assistant',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, context } = body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json(
        { success: false, error: 'Question is required', errorCode: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const result = await askAI(question.trim(), context);

    return NextResponse.json({
      success: true,
      answer: result.answer,
      summary: result.summary,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', errorCode: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
