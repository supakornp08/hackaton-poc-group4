// Types for the application

// Document types
export interface Document {
  id: string;
  title: string;
  fileName: string;
  size: number;
  uploadedAt: string;
  content?: string;
}

export interface UploadResponse {
  success: boolean;
  documents: Document[];
  errors?: string[];
}

export interface SummarizeResponse {
  success: boolean;
  documentId: string;
  fileName: string;
  summary: string;
  summaryType: string;
}

export interface DeleteResponse {
  success: boolean;
}

// Search types
export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  score: number;
}

export interface SearchResponse {
  success: boolean;
  results: SearchResult[];
  error?: string;
}

// Chat types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AskRequest {
  question: string;
  context?: string;
}

export interface AskResponse {
  success: boolean;
  answer: string;
  summary?: string;
  timestamp: string;
}

// Summary types
export type SummaryType = 'general' | 'bullet' | 'technical' | 'executive';

export interface SummaryTypeOption {
  value: SummaryType;
  label: string;
  description: string;
}

export const SUMMARY_TYPES: SummaryTypeOption[] = [
  { value: 'general', label: 'สรุปทั่วไป', description: 'สรุปเนื้อหาโดยรวม' },
  { value: 'bullet', label: 'แบบหัวข้อ', description: 'สรุปเป็นข้อๆ' },
  { value: 'technical', label: 'เชิงเทคนิค', description: 'เน้นรายละเอียดทางเทคนิค' },
  { value: 'executive', label: 'สำหรับผู้บริหาร', description: 'สรุปภาพรวมสำหรับการตัดสินใจ' },
];

// Form types for Smart Form
export interface FormData {
  // Personal Info
  titleName: string;
  firstName: string;
  lastName: string;
  firstNameEn: string;
  lastNameEn: string;
  idCard: string;
  birthDate: string;
  nationality: string;

  // Contact Info
  phone: string;
  email: string;

  // Address
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;

  // Business Info
  companyName: string;
  businessType: string;
  annualRevenue: string;
  exportCountries: string;
}

// Currency pair interface for TradingView charts
export interface CurrencyPair {
  symbol: string;
  name: string;
  flag: string;
}

// Quick service interface for dashboard services
export interface QuickService {
  icon: string;
  title: string;
  desc: string;
}

// Health check response
export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}
