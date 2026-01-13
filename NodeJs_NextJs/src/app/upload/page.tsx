'use client';

import { useState, useEffect, useCallback } from 'react';
import { Document, SummarizeResponse, SUMMARY_TYPES, SummaryType } from '@/types';

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  
  // AI Summary feature
  const [selectedSummaryType, setSelectedSummaryType] = useState<SummaryType>('general');
  const [isSummarizing, setIsSummarizing] = useState<Record<string, boolean>>({});
  const [summaryResults, setSummaryResults] = useState<Record<string, SummarizeResponse>>({});

  const showMessage = useCallback((msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  }, []);

  const loadDocuments = useCallback(async () => {
    try {
      const response = await fetch('/api/upload');
      const data = await response.json();
      if (data.success) {
        setUploadedDocs(data.documents);
      }
    } catch (err) {
      console.error('Error loading documents:', err);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      showMessage('กรุณาเลือกไฟล์ก่อน', 'error');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadedDocs([...uploadedDocs, ...data.documents]);
        showMessage(`อัพโหลดสำเร็จ ${data.documents.length} ไฟล์`, 'success');
        setSelectedFiles([]);
      }

      if (data.errors?.length) {
        showMessage(`บางไฟล์อัพโหลดไม่สำเร็จ: ${data.errors.join(', ')}`, 'error');
      }
    } catch (err) {
      showMessage('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'), 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSummarize = async (doc: Document) => {
    setIsSummarizing({ ...isSummarizing, [doc.id]: true });

    try {
      const response = await fetch(`/api/upload/summarize/${doc.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summaryType: selectedSummaryType }),
      });

      const data = await response.json();

      if (data.success) {
        setSummaryResults({ ...summaryResults, [doc.id]: data });
        showMessage('สรุปเอกสารสำเร็จ!', 'success');
      } else {
        showMessage('เกิดข้อผิดพลาดในการสรุป', 'error');
      }
    } catch (err) {
      showMessage('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'), 'error');
    } finally {
      setIsSummarizing({ ...isSummarizing, [doc.id]: false });
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm(`คุณต้องการลบเอกสาร "${doc.fileName}" หรือไม่?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/upload/documents/${doc.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setUploadedDocs(uploadedDocs.filter(d => d.id !== doc.id));
        const newSummaryResults = { ...summaryResults };
        delete newSummaryResults[doc.id];
        setSummaryResults(newSummaryResults);
        showMessage('ลบเอกสารสำเร็จ', 'success');
      }
    } catch (err) {
      showMessage('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'), 'error');
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📤 อัพโหลดเอกสาร</h1>
        <p className="text-gray-600">อัพโหลดเอกสารและใช้ AI สรุปเนื้อหา</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            messageType === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Upload Area */}
      <div className="card">
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <div className="text-5xl mb-4">📁</div>
          <p className="text-gray-600 mb-2">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
          <p className="text-sm text-gray-400">รองรับไฟล์ .txt, .md, .pdf, .docx (สูงสุด 50MB)</p>
          <input
            id="fileInput"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept=".txt,.md,.pdf,.docx,.doc"
          />
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">📎 ไฟล์ที่เลือก ({selectedFiles.length})</h3>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="mt-4 btn btn-primary w-full flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="spinner w-5 h-5"></div>
                  กำลังอัพโหลด...
                </>
              ) : (
                <>
                  📤 อัพโหลดไฟล์
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Summary Type Selection */}
      <div className="card">
        <h3 className="font-semibold mb-4">🤖 ประเภทการสรุป AI</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SUMMARY_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedSummaryType(type.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedSummaryType === type.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium">{type.label}</p>
              <p className="text-xs text-gray-500">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Uploaded Documents */}
      {uploadedDocs.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-4">📚 เอกสารที่อัพโหลด ({uploadedDocs.length})</h3>
          <div className="space-y-4">
            {uploadedDocs.map((doc) => (
              <div key={doc.id} className="border rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📄</span>
                    <div>
                      <p className="font-semibold text-gray-800">{doc.title}</p>
                      <p className="text-sm text-gray-500">
                        {doc.fileName} • {formatFileSize(doc.size)} •{' '}
                        {new Date(doc.uploadedAt).toLocaleString('th-TH')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSummarize(doc)}
                      disabled={isSummarizing[doc.id]}
                      className="btn btn-primary text-sm"
                    >
                      {isSummarizing[doc.id] ? (
                        <>
                          <span className="spinner w-4 h-4 mr-1"></span>
                          กำลังสรุป...
                        </>
                      ) : (
                        '🤖 สรุปด้วย AI'
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(doc)}
                      className="btn btn-danger text-sm"
                    >
                      🗑️ ลบ
                    </button>
                  </div>
                </div>

                {/* Summary Result */}
                {summaryResults[doc.id] && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-primary-700">
                        ✨ ผลการสรุป ({summaryResults[doc.id].summaryType})
                      </h4>
                      <button
                        onClick={() => {
                          const newResults = { ...summaryResults };
                          delete newResults[doc.id];
                          setSummaryResults(newResults);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700">
                        {summaryResults[doc.id].summary}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {uploadedDocs.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">ยังไม่มีเอกสาร</h3>
          <p className="text-gray-500">เริ่มต้นอัพโหลดเอกสารเพื่อใช้งานฟีเจอร์ AI สรุปเนื้อหา</p>
        </div>
      )}
    </div>
  );
}
