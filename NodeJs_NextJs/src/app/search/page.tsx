'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { SearchResult, Document } from '@/types';

type TabType = 'search' | 'documents';

// Default search suggestions
const DEFAULT_SUGGESTIONS = [
  'อัตราแลกเปลี่ยน',
  'สินเชื่อส่งออก',
  'Letter of Credit',
  'Forward Contract',
  'ประกันการส่งออก',
  'บริการโอนเงิน',
  'เอกสารการค้า',
  'Trust Receipt',
];

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter suggestions based on search query
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return DEFAULT_SUGGESTIONS;
    return DEFAULT_SUGGESTIONS.filter(s => 
      s.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const loadDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    try {
      const response = await fetch('/api/upload');
      const data = await response.json();
      if (data.success) {
        setAllDocuments(data.documents);
      }
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setIsLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleSearch = async (query?: string) => {
    const searchTerm = (query || searchQuery).trim();
    if (!searchTerm) return;

    setSearchQuery(searchTerm);
    setShowSuggestions(false);
    setIsSearching(true);
    setErrorMessage('');
    setSearchResults([]);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.results);
        if (data.results.length === 0) {
          setErrorMessage(`ไม่พบเอกสารที่ตรงกับ "${searchTerm}"`);
        }
      } else {
        setErrorMessage(data.error || 'เกิดข้อผิดพลาดในการค้นหา');
      }
    } catch (err) {
      setErrorMessage('เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('คุณต้องการลบเอกสารนี้หรือไม่?')) return;

    try {
      const response = await fetch(`/api/upload/documents/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setAllDocuments(allDocuments.filter(d => d.id !== id));
      }
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🔍 ค้นหาเอกสาร</h1>
        <p className="text-gray-600">ค้นหาและจัดการเอกสารในระบบ</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'search'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🔍 ค้นหา
        </button>
        <button
          onClick={() => {
            setActiveTab('documents');
            loadDocuments();
          }}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'documents'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📚 เอกสารทั้งหมด ({allDocuments.length})
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Search Input with Suggestions */}
          <div className="card">
            <div className="relative">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyPress={handleKeyPress}
                    placeholder="พิมพ์คำค้นหา..."
                    className="input w-full"
                  />
                  
                  {/* Autocomplete Suggestions Dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      <div className="p-2 text-xs text-gray-500 border-b">💡 คำแนะนำการค้นหา</div>
                      {filteredSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onMouseDown={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-2 hover:bg-primary-50 hover:text-primary-700 transition-colors flex items-center gap-2"
                        >
                          <span className="text-gray-400">🔍</span>
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleSearch()}
                  disabled={isSearching || !searchQuery.trim()}
                  className="btn btn-primary px-6"
                >
                  {isSearching ? (
                    <>
                      <span className="spinner w-5 h-5 mr-2"></span>
                      กำลังค้นหา...
                    </>
                  ) : (
                    '🔍 ค้นหา'
                  )}
                </button>
              </div>
            </div>
            
            {/* Quick Search Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">ค้นหาด่วน:</span>
              {DEFAULT_SUGGESTIONS.slice(0, 5).map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(tag)}
                  className="px-3 py-1 bg-gray-100 hover:bg-primary-100 hover:text-primary-700 text-sm rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="card">
              <h3 className="font-semibold mb-4">
                ผลการค้นหา ({searchResults.length} รายการ)
              </h3>
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          📄 {result.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">{result.snippet}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            คะแนน: {result.score.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isSearching && searchResults.length === 0 && !errorMessage && (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">🔎</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">ค้นหาเอกสาร</h3>
              <p className="text-gray-500">พิมพ์คำค้นหาเพื่อค้นหาเอกสารในระบบ</p>
            </div>
          )}
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          {isLoadingDocs ? (
            <div className="card text-center py-12">
              <div className="spinner w-12 h-12 mx-auto mb-4"></div>
              <p className="text-gray-500">กำลังโหลดเอกสาร...</p>
            </div>
          ) : allDocuments.length > 0 ? (
            <div className="card">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        เอกสาร
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ขนาด
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        วันที่อัพโหลด
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        การดำเนินการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">📄</span>
                            <div>
                              <p className="font-medium text-gray-900">{doc.title}</p>
                              <p className="text-sm text-gray-500">{doc.fileName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatFileSize(doc.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(doc.uploadedAt).toLocaleString('th-TH')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                          >
                            🗑️ ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">ยังไม่มีเอกสาร</h3>
              <p className="text-gray-500">ไปที่หน้าอัพโหลดเพื่อเพิ่มเอกสารใหม่</p>
              <a href="/upload" className="btn btn-primary mt-4 inline-block">
                📤 อัพโหลดเอกสาร
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
