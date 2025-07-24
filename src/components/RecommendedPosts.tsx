'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface BlogPost {
  _id: string;
  slug: string;
  content: {
    ko?: {
      title: string;
      subtitle: string;
      thumbnail_url: string;
    };
    en?: {
      title: string;
      subtitle: string;
      thumbnail_url: string;
    };
  };
  created_at: string;
  tags: string[];
}

interface RecommendedPostsProps {
  currentSlug: string;
}

const RecommendedPosts: React.FC<RecommendedPostsProps> = ({ currentSlug }) => {
  const { t, i18n } = useTranslation('common');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [paused, setPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const POSITIONS = [
    { scale: 0.8, z: -200, x: '-36vw', opacity: 0, zIndex: 0, y: 0 },    // 완전 투명, 점프용
    { scale: 0.92, z: -80, x: '-24vw', opacity: 0.6, zIndex: 1, y: 0 },
    { scale: 0.97, z: -30, x: '-12vw', opacity: 0.8, zIndex: 2, y: 0 },
    { scale: 1.1, z: 0, x: '0vw', opacity: 1, zIndex: 10, y: -24 },         // center, 강조
    { scale: 0.97, z: -30, x: '12vw', opacity: 0.8, zIndex: 2, y: 0 },
    { scale: 0.92, z: -80, x: '24vw', opacity: 0.6, zIndex: 1, y: 0 },    // 오른쪽 끝
  ];

  const fetchRandomPosts = async () => {
    try {
      const response = await fetch(`/api/blog/random?limit=5&exclude=${currentSlug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch random posts');
      }
      const data = await response.json();
      setPosts(data.results || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recommended posts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomPosts();
  }, [currentSlug]);

  const CARD_SIZE = 'clamp(220px, 22vw, 400px)';
  const ANIMATION_DURATION = 2000; // 2초
  const SLIDE_INTERVAL = 5000; // 5초

  useEffect(() => {
    if (posts.length <= 4) return;
    if (paused) return;
    let step = 0;
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;
    function startSlide() {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < 5) {
            return prev + 1;
          } else {
            // 애니메이션 끝나면 posts 배열 회전
            timeout = setTimeout(() => {
              setPosts(prevPosts => {
                const newArr = [...prevPosts];
                const first = newArr.shift();
                if (first) newArr.push(first);
                return newArr;
              });
              setCurrentStep(0);
            }, ANIMATION_DURATION);
            return prev;
          }
        });
      }, SLIDE_INTERVAL);
    }
    startSlide();
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [posts.length, paused]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '. ');
  };

  if (loading) {
    return (
      <div className="bg-gray-50 fluid-py-16">
        <div className="fluid-container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 fluid-text-base">게시물을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

      return (
      <div className="bg-gray-50 fluid-py-16">
        <div className="fluid-container">
          {/* 섹션 헤더 */}
          <div className="text-center fluid-mb-12">
            <h2 className="fluid-text-3xl font-bold text-gray-900 fluid-mb-4">
              다른 이야기가 궁금하시다면?
            </h2>
          </div>

                        {/* 캐러셀 컨테이너 - 3개만 고정 표시 */}
        <div className="relative w-full max-w-5xl mx-auto" style={{ height: `calc(${CARD_SIZE} + 40px)` }}>
          <div
            style={{ position: 'relative', width: '100%', height: '100%' }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {posts.slice(0, 6).map((post, index) => {
              const content = post.content[i18n.language as keyof typeof post.content] || post.content.ko || post.content.en;
              if (!content) return null;
              // step에 따라 카드 위치를 한 칸씩 이동
              const posIdx = (index - currentStep + 6) % 6;
              const pos = POSITIONS[posIdx];
              return (
                <div
                  key={post._id}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: CARD_SIZE,
                    height: CARD_SIZE,
                    opacity: pos.opacity,
                    zIndex: pos.zIndex,
                    transform: `translate(-50%, -50%) translateX(${pos.x}) scale(${pos.scale}) translateY(${pos.y || 0}px) translateZ(${pos.z}px)` ,
                    transition: `all ${ANIMATION_DURATION}ms cubic-bezier(0.77,0,0.18,1)`
                  }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className={`block bg-white rounded-xl overflow-hidden shadow-lg w-full h-full`}
                    style={{ height: '100%', width: '100%' }}
                  >
                    {/* 이미지 */}
                    <div
                      className="relative bg-gray-200 w-full h-1/2"
                      style={{ height: '50%' }}
                    >
                      {content.thumbnail_url ? (
                        <img
                          src={content.thumbnail_url}
                          alt={content.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1/1' }}
                          onError={e => { (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png'; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <img
                            src="/logo/nonImage_logo.png"
                            alt="기본 이미지"
                            style={{ width: '60px', height: '60px', opacity: 0.5 }}
                          />
                        </div>
                      )}
                    </div>
                    {/* 콘텐츠 */}
                    <div
                      className="flex flex-col justify-between p-4 h-1/2"
                      style={{ height: '50%' }}
                    >
                      <div>
                        <h3
                          className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors"
                          style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.3rem)' }}
                        >
                          {content.title}
                        </h3>
                        <p
                          className="text-gray-600 mb-2 line-clamp-2"
                          style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)' }}
                        >
                          {content.subtitle}
                        </p>
                      </div>
                      <div
                        className="text-gray-500"
                        style={{ fontSize: 'clamp(0.8rem, 1vw, 1rem)' }}
                      >
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 스타일 */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default RecommendedPosts; 