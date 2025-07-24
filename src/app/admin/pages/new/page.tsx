'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const NewPage: React.FC = () => {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [pageKey, setPageKey] = useState('');
  const [sections, setSections] = useState<Array<{
    id: string;
    section_key: string;
    type: string;
    content: Record<string, any>;
  }>>([]);

  const formData = {
    ko: {
      title: '새 페이지 생성',
      back: '목록으로 돌아가기',
      form: {
        pageKey: '페이지 키',
        pageKeyPlaceholder: '예: home, about, contact',
        sections: '섹션',
        addSection: '섹션 추가',
        sectionKey: '섹션 키',
        sectionType: '섹션 타입',
        content: '콘텐츠',
        save: '저장',
        cancel: '취소'
      },
      sectionTypes: {
        text: '텍스트',
        image: '이미지',
        video: '비디오',
        gallery: '갤러리',
        form: '폼'
      },
      content: {
        ko: '한국어',
        en: '영어'
      }
    },
    en: {
      title: 'Create New Page',
      back: 'Back to List',
      form: {
        pageKey: 'Page Key',
        pageKeyPlaceholder: 'e.g., home, about, contact',
        sections: 'Sections',
        addSection: 'Add Section',
        sectionKey: 'Section Key',
        sectionType: 'Section Type',
        content: 'Content',
        save: 'Save',
        cancel: 'Cancel'
      },
      sectionTypes: {
        text: 'Text',
        image: 'Image',
        video: 'Video',
        gallery: 'Gallery',
        form: 'Form'
      },
      content: {
        ko: 'Korean',
        en: 'English'
      }
    }
  };

  const t = formData[lang];

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      section_key: '',
      type: 'text',
      content: { ko: '', en: '' }
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, field: string, value: any) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic here
    console.log('Saving page:', { pageKey, sections });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600 mt-1">
            {lang === 'ko' ? '새 페이지를 생성합니다.' : 'Create a new page.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="border rounded-lg px-3 py-2"
            value={lang}
            onChange={(e) => setLang(e.target.value as 'ko' | 'en')}
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
          <Link
            href="/admin/pages"
            className="text-gray-600 hover:text-gray-800"
          >
            {t.back}
          </Link>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          {/* Page Key */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.form.pageKey}
            </label>
            <input
              type="text"
              value={pageKey}
              onChange={(e) => setPageKey(e.target.value)}
              placeholder={t.form.pageKeyPlaceholder}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Sections */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {t.form.sections}
              </label>
              <button
                type="button"
                onClick={addSection}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.form.addSection}
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {lang === 'ko' ? '섹션이 없습니다. 섹션을 추가해주세요.' : 'No sections. Please add a section.'}
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((section, index) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">
                        {t.form.sections} {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeSection(section.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        삭제
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.form.sectionKey}
                        </label>
                        <input
                          type="text"
                          value={section.section_key}
                          onChange={(e) => updateSection(section.id, 'section_key', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.form.sectionType}
                        </label>
                        <select
                          value={section.type}
                          onChange={(e) => updateSection(section.id, 'type', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {Object.entries(t.sectionTypes).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Content for each language */}
                    <div className="space-y-4">
                      <h5 className="font-medium text-gray-700">{t.form.content}</h5>
                      {Object.entries(t.content).map(([langKey, langLabel]) => (
                        <div key={langKey}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {langLabel}
                          </label>
                          <textarea
                            value={section.content[langKey] || ''}
                            onChange={(e) => updateSection(section.id, 'content', {
                              ...section.content,
                              [langKey]: e.target.value
                            })}
                            rows={4}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/pages"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t.form.cancel}
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t.form.save}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPage; 