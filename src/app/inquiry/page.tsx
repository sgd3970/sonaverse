'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../app/i18n';

const categories = [
  { key: 'product_purchase', label_ko: '제품 구매 문의', label_en: 'Product Purchase Inquiry' },
  { key: 'partnership', label_ko: '제휴 문의', label_en: 'Partnership Inquiry' },
  { key: 'technical_support', label_ko: '기술 지원 문의', label_en: 'Technical Support Inquiry' },
];

const InquiryPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const [form, setForm] = useState({
    category: '',
    name: '',
    company: '',
    phone: '',
    email: '',
    message: '',
    file: undefined as File | undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, file: e.target.files?.[0] }));
  };

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('inquiry', '기업 문의')}</h1>
        <form className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            {t('inquiry_category', '문의 카테고리')}
            <select name="category" value={form.category} onChange={handleChange} className="border rounded px-3 py-2">
              <option value="">{t('select_category', '카테고리 선택')}</option>
              {categories.map(cat => (
                <option key={cat.key} value={cat.key}>
                  {i18n.language === 'en' ? cat.label_en : cat.label_ko}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            {t('name', '이름')}
            <input name="name" value={form.name} onChange={handleChange} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            {t('company', '회사명')}
            <input name="company" value={form.company} onChange={handleChange} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            {t('phone', '연락처')}
            <input name="phone" value={form.phone} onChange={handleChange} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            {t('email', '이메일')}
            <input name="email" value={form.email} onChange={handleChange} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            {t('message', '문의 내용')}
            <textarea name="message" value={form.message} onChange={handleChange} className="border rounded px-3 py-2 min-h-[100px]" />
          </label>
          <label className="flex flex-col gap-1">
            {t('attachment', '첨부 파일')}
            <input type="file" name="file" onChange={handleFile} className="border rounded px-3 py-2" />
          </label>
          <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition">
            {t('submit', '문의하기')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InquiryPage; 