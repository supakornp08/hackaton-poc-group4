# EXIM Bank Services - Next.js

โปรเจกต์ระบบบริการธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย สร้างด้วย Node.js และ Next.js

## 🚀 Features

### Frontend (Next.js + React)
- **Dashboard** - หน้าแรกแสดงบริการธนาคาร กราฟอัตราแลกเปลี่ยน (TradingView)
- **Upload** - อัพโหลดเอกสารและสรุปเนื้อหาด้วย AI
- **Search** - ค้นหาเอกสารในระบบ
- **Register (Smart Form)** - กรอกแบบฟอร์มอัตโนมัติจากรูปบัตรประชาชน
- **Chat Widget** - ผู้ช่วย AI สำหรับตอบคำถาม

### Backend (Next.js API Routes)
- **POST /api/upload** - อัพโหลดเอกสาร
- **GET /api/upload** - ดึงรายการเอกสารทั้งหมด
- **DELETE /api/upload/documents/[id]** - ลบเอกสาร
- **POST /api/upload/summarize/[id]** - สรุปเอกสารด้วย AI
- **POST /api/chat/ask** - ถาม-ตอบกับ AI
- **GET /api/chat/health** - Health check
- **GET /api/search** - ค้นหาเอกสาร

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes (Node.js)
- **Styling**: TailwindCSS, Custom CSS
- **Charts**: TradingView Widget

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## 🔧 Environment Variables

```env
# Azure AI Services (Optional - for production AI features)
AZURE_OPENAI_ENDPOINT=https://your-openai.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Azure Search (Optional - for production search)
AZURE_SEARCH_ENDPOINT=https://your-search.search.windows.net
AZURE_SEARCH_API_KEY=your-search-api-key
AZURE_SEARCH_INDEX_NAME=knowledgedocs
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # API Routes (Backend)
│   │   ├── chat/
│   │   │   ├── ask/route.ts    # Chat endpoint
│   │   │   └── health/route.ts # Health check
│   │   ├── search/route.ts     # Search endpoint
│   │   └── upload/
│   │       ├── route.ts        # Upload & list documents
│   │       ├── documents/[id]/ # Delete document
│   │       └── summarize/[id]/ # AI summarization
│   ├── page.tsx                # Dashboard
│   ├── upload/page.tsx         # Upload page
│   ├── search/page.tsx         # Search page
│   ├── register/page.tsx       # Smart Form page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── Navbar.tsx              # Navigation bar
│   └── ChatWidget.tsx          # Floating chat widget
└── types/
    └── index.ts                # TypeScript types
```

## 🎯 Original Project (Angular + .NET)

โปรเจกต์นี้ clone features มาจาก `C:\Source\Hackaton` ที่ใช้:
- Frontend: Angular
- Backend: .NET Core

## 📝 Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/upload | Upload documents |
| GET | /api/upload | List all documents |
| DELETE | /api/upload/documents/:id | Delete a document |
| POST | /api/upload/summarize/:id | Summarize document with AI |
| POST | /api/chat/ask | Ask AI a question |
| GET | /api/chat/health | Health check |
| GET | /api/search?q=query | Search documents |

## 📄 License

MIT
