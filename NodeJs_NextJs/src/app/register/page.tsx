'use client';

import { useState, useCallback } from 'react';
import { FormData } from '@/types';

const initialFormData: FormData = {
  titleName: '',
  firstName: '',
  lastName: '',
  firstNameEn: '',
  lastNameEn: '',
  idCard: '',
  birthDate: '',
  nationality: 'ไทย',
  phone: '',
  email: '',
  address: '',
  subDistrict: '',
  district: '',
  province: '',
  postalCode: '',
  companyName: '',
  businessType: '',
  annualRevenue: '',
  exportCountries: '',
};

const titleOptions = ['นาย', 'นาง', 'นางสาว', 'ดร.', 'ศ.', 'รศ.', 'ผศ.'];

const provinces = [
  'กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'เชียงใหม่',
  'ชลบุรี', 'ภูเก็ต', 'ขอนแก่น', 'นครราชสีมา', 'สงขลา'
];

const businessTypes = [
  'ส่งออกสินค้าเกษตร', 'ส่งออกสินค้าอุตสาหกรรม', 'ส่งออกอาหารและเครื่องดื่ม',
  'ส่งออกเครื่องจุนหมึ่น', 'ส่งออกอิเล็กทรอนิกส์', 'อื่นๆ'
];

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showMessage = useCallback((text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  }, []);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMessage('กรุณาเลือกไฟล์รูปภาพ', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showMessage('ขนาดไฟล์ต้องไม่เกิน 10MB', 'error');
      return;
    }

    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateSampleIdCard = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 380;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 600, 380);
    gradient.addColorStop(0, '#1a237e');
    gradient.addColorStop(1, '#283593');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 380);

    // Header band
    ctx.fillStyle = '#c62828';
    ctx.fillRect(0, 0, 600, 50);

    // Header text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('บัตรประจำตัวประชาชน', 300, 32);

    // Thailand text
    ctx.font = '12px Arial, sans-serif';
    ctx.fillText('THAILAND IDENTIFICATION CARD', 300, 65);

    // Photo placeholder
    ctx.fillStyle = '#e3f2fd';
    ctx.fillRect(30, 80, 140, 180);
    ctx.fillStyle = '#1565c0';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📷', 100, 180);
    ctx.font = '12px Arial';
    ctx.fillText('รูปถ่าย', 100, 240);

    // Personal information
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial, sans-serif';
    ctx.textAlign = 'left';

    const info = [
      { label: 'เลขประจำตัวประชาชน', value: '1-1234-56789-01-2', y: 95 },
      { label: 'ชื่อ-สกุล', value: 'นาย สมชาย รักประเทศ', y: 130 },
      { label: 'Name', value: 'Mr. SOMCHAI RAKPRATHET', y: 160 },
      { label: 'วันเกิด', value: '15 มี.ค. 2528 / 15 Mar 1985', y: 195 },
      { label: 'ที่อยู่', value: '123/45 หมู่ 6 ซ.สุขุมวิท 55', y: 230 },
      { label: '', value: 'แขวงคลองตันเหนือ เขตวัฒนา', y: 250 },
      { label: '', value: 'กรุงเทพมหานคร 10110', y: 270 }
    ];

    info.forEach(item => {
      if (item.label) {
        ctx.fillStyle = '#90caf9';
        ctx.fillText(item.label, 190, item.y);
      }
      ctx.fillStyle = '#ffffff';
      ctx.font = item.label ? 'bold 14px Arial' : '13px Arial';
      ctx.fillText(item.value, 190, item.y + (item.label ? 18 : 0));
      ctx.font = '14px Arial';
    });

    // Footer
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(0, 330, 600, 50);
    ctx.fillStyle = '#1a237e';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('* นี่คือรูปตัวอย่างสำหรับการสาธิต Smart Form Filler *', 300, 350);
    ctx.fillText('SAMPLE IMAGE FOR DEMO PURPOSES ONLY', 300, 365);

    return canvas.toDataURL('image/png');
  };

  const useSampleImage = () => {
    setSelectedFileName('sample_id_card.png');
    setSelectedImage(generateSampleIdCard());
    showMessage('ใช้รูปตัวอย่างแล้ว กด "วิเคราะห์ด้วย AI" เพื่อกรอกข้อมูล', 'info');
  };

  const fillFormWithSampleData = () => {
    setFormData({
      titleName: 'นาย',
      firstName: 'สมชาย',
      lastName: 'รักประเทศ',
      firstNameEn: 'SOMCHAI',
      lastNameEn: 'RAKPRATHET',
      idCard: '1-1234-56789-01-2',
      birthDate: '1985-03-15',
      nationality: 'ไทย',
      phone: '081-234-5678',
      email: 'somchai.r@email.com',
      address: '123/45 หมู่ 6 ซอยสุขุมวิท 55',
      subDistrict: 'คลองตันเหนือ',
      district: 'วัฒนา',
      province: 'กรุงเทพมหานคร',
      postalCode: '10110',
      companyName: 'บริษัท ส่งออกไทย จำกัด',
      businessType: 'ส่งออกสินค้าเกษตร',
      annualRevenue: '50,000,000',
      exportCountries: 'จีน, ญี่ปุ่น, สหรัฐอเมริกา'
    });
  };

  const processImage = async () => {
    if (!selectedImage) {
      showMessage('กรุณาเลือกรูปภาพก่อน', 'error');
      return;
    }

    setIsProcessing(true);

    const steps = [
      { text: 'กำลังตรวจจับข้อความในรูปภาพ...', delay: 1000 },
      { text: 'กำลังแยกแยะข้อมูลบุคคล...', delay: 1500 },
      { text: 'กำลังตรวจสอบความถูกต้อง...', delay: 1000 },
      { text: 'กำลังกรอกข้อมูลลงฟอร์ม...', delay: 800 }
    ];

    for (const step of steps) {
      setProcessingStep(step.text);
      await delay(step.delay);
    }

    fillFormWithSampleData();
    setIsFormFilled(true);
    setIsProcessing(false);
    setProcessingStep('');
    showMessage('กรอกข้อมูลสำเร็จ! AI ได้กรอกข้อมูลจากรูปภาพเรียบร้อยแล้ว', 'success');
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const submitForm = () => {
    showMessage('สมัครสมาชิกสำเร็จ! ระบบจะส่งข้อมูลการยืนยันไปยังอีเมลของท่าน', 'success');
    setTimeout(() => {
      setFormData(initialFormData);
      setSelectedImage(null);
      setSelectedFileName('');
      setIsFormFilled(false);
      setCurrentStep(1);
    }, 2000);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedImage(null);
    setSelectedFileName('');
    setIsFormFilled(false);
    setCurrentStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📝 Smart Form Filler</h1>
        <p className="text-gray-600">กรอกแบบฟอร์มอัตโนมัติด้วย AI จากรูปบัตรประชาชน</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : message.type === 'error'
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-blue-100 text-blue-800 border border-blue-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= step
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-8 text-sm text-gray-500">
        <span>อัพโหลดรูป</span>
        <span>ข้อมูลส่วนตัว</span>
        <span>ข้อมูลธุรกิจ</span>
      </div>

      {/* Step 1: Upload Image */}
      {currentStep === 1 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">📷 อัพโหลดรูปบัตรประชาชน</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div>
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors cursor-pointer"
                onClick={() => document.getElementById('imageInput')?.click()}
              >
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="max-w-full max-h-64 mx-auto rounded-lg"
                  />
                ) : (
                  <>
                    <div className="text-5xl mb-4">🖼️</div>
                    <p className="text-gray-600">คลิกเพื่อเลือกรูปภาพ</p>
                    <p className="text-sm text-gray-400 mt-2">รองรับ JPG, PNG (สูงสุด 10MB)</p>
                  </>
                )}
              </div>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              {selectedFileName && (
                <p className="text-sm text-gray-500 mt-2 text-center">📎 {selectedFileName}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center gap-4">
              <button
                onClick={useSampleImage}
                className="btn btn-secondary flex items-center justify-center gap-2"
              >
                🎯 ใช้รูปตัวอย่าง
              </button>

              <button
                onClick={processImage}
                disabled={!selectedImage || isProcessing}
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="spinner w-5 h-5"></div>
                    {processingStep}
                  </>
                ) : (
                  <>🤖 วิเคราะห์ด้วย AI</>
                )}
              </button>

              {isFormFilled && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
                  ✅ กรอกข้อมูลอัตโนมัติสำเร็จ!
                </div>
              )}

              <button onClick={nextStep} className="btn btn-primary mt-4">
                ถัดไป →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Personal Info */}
      {currentStep === 2 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">👤 ข้อมูลส่วนบุคคล</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">คำนำหน้า</label>
              <select
                value={formData.titleName}
                onChange={(e) => updateField('titleName', e.target.value)}
                className="input"
              >
                <option value="">เลือกคำนำหน้า</option>
                {titleOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เลขบัตรประชาชน</label>
              <input
                type="text"
                value={formData.idCard}
                onChange={(e) => updateField('idCard', e.target.value)}
                className="input"
                placeholder="x-xxxx-xxxxx-xx-x"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ (ภาษาไทย)</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล (ภาษาไทย)</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name (English)</label>
              <input
                type="text"
                value={formData.firstNameEn}
                onChange={(e) => updateField('firstNameEn', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name (English)</label>
              <input
                type="text"
                value={formData.lastNameEn}
                onChange={(e) => updateField('lastNameEn', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">วันเกิด</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => updateField('birthDate', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">สัญชาติ</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => updateField('nationality', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">โทรศัพท์</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="input"
                placeholder="0xx-xxx-xxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">แขวง/ตำบล</label>
              <input
                type="text"
                value={formData.subDistrict}
                onChange={(e) => updateField('subDistrict', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เขต/อำเภอ</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => updateField('district', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">จังหวัด</label>
              <select
                value={formData.province}
                onChange={(e) => updateField('province', e.target.value)}
                className="input"
              >
                <option value="">เลือกจังหวัด</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รหัสไปรษณีย์</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => updateField('postalCode', e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={prevStep} className="btn btn-secondary">
              ← ย้อนกลับ
            </button>
            <button onClick={nextStep} className="btn btn-primary">
              ถัดไป →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Business Info */}
      {currentStep === 3 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">🏢 ข้อมูลธุรกิจ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อบริษัท/กิจการ</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทธุรกิจ</label>
              <select
                value={formData.businessType}
                onChange={(e) => updateField('businessType', e.target.value)}
                className="input"
              >
                <option value="">เลือกประเภทธุรกิจ</option>
                {businessTypes.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รายได้ต่อปี (บาท)</label>
              <input
                type="text"
                value={formData.annualRevenue}
                onChange={(e) => updateField('annualRevenue', e.target.value)}
                className="input"
                placeholder="เช่น 10,000,000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">ประเทศที่ส่งออก</label>
              <input
                type="text"
                value={formData.exportCountries}
                onChange={(e) => updateField('exportCountries', e.target.value)}
                className="input"
                placeholder="เช่น จีน, ญี่ปุ่น, สหรัฐอเมริกา"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">📋 สรุปข้อมูล</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="text-gray-500">ชื่อ:</span> {formData.titleName} {formData.firstName} {formData.lastName}</p>
              <p><span className="text-gray-500">เลขบัตร:</span> {formData.idCard}</p>
              <p><span className="text-gray-500">อีเมล:</span> {formData.email}</p>
              <p><span className="text-gray-500">โทร:</span> {formData.phone}</p>
              <p><span className="text-gray-500">บริษัท:</span> {formData.companyName}</p>
              <p><span className="text-gray-500">ธุรกิจ:</span> {formData.businessType}</p>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={prevStep} className="btn btn-secondary">
              ← ย้อนกลับ
            </button>
            <div className="flex gap-3">
              <button onClick={resetForm} className="btn btn-secondary">
                🔄 รีเซ็ต
              </button>
              <button onClick={submitForm} className="btn btn-success">
                ✅ ยืนยันสมัคร
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
