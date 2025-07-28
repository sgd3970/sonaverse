'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ProductPreviewData {
  slug: string;
  name: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  thumbnail_image: string;
  product_images: string[];
  detail_images: string[];
  category: string;
}

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductPreviewData | null;
}

const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { i18n } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const getLocalizedText = (obj: { ko: string; en: string }, lang: string): string => {
    return obj[lang as keyof typeof obj] || obj.ko;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">제품 미리보기</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-6">
          {/* 썸네일 카드 미리보기 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">썸네일 카드</h3>
            <div className="bg-white border border-gray-200 overflow-hidden max-w-sm">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.thumbnail_image}
                  alt={getLocalizedText(product.name, i18n.language)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png';
                  }}
                />
              </div>
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {getLocalizedText(product.name, i18n.language)}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {getLocalizedText(product.description, i18n.language)}
                </p>
                <div className="mt-3">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {product.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 제품 상세 페이지 미리보기 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">제품 상세 페이지</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 좌측 - 제품 이미지 */}
                <div className="space-y-4">
                  {/* 메인 이미지 */}
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={product.product_images[currentImageIndex] || product.thumbnail_image}
                      alt={getLocalizedText(product.name, i18n.language)}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png';
                      }}
                    />
                  </div>

                  {/* 썸네일 이미지들 */}
                  {product.product_images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto">
                      {product.product_images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            currentImageIndex === index
                              ? 'border-blue-500'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${getLocalizedText(product.name, i18n.language)} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 우측 - 제품 정보 */}
                <div className="space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-4">
                      {product.category}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {getLocalizedText(product.name, i18n.language)}
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {getLocalizedText(product.description, i18n.language)}
                    </p>
                  </div>

                  {/* 구매 버튼 */}
                  <div className="pt-6">
                    <button className="inline-flex items-center justify-center w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg">
                      제품 구매 문의하기
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 상세 페이지 이미지들 */}
          {product.detail_images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">상세 페이지 이미지들</h3>
              <div className="space-y-4">
                {product.detail_images.map((image, index) => (
                  <div key={index} className="w-full">
                    <img
                      src={image}
                      alt={`${getLocalizedText(product.name, i18n.language)} 상세 이미지 ${index + 1}`}
                      className="w-full h-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewModal; 