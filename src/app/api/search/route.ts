import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import BlogPost from '../../../models/BlogPost';
import PressRelease from '../../../models/PressRelease';
import Product from '../../../models/Product';
import BrandStory from '../../../models/BrandStory';
import { addSearchKeyword } from '../admin/analytics/route';

/**
 * 통합 검색 API
 * 블로그, 언론보도, 제품, 브랜드 스토리에서 검색을 수행합니다.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const lang = searchParams.get('lang') || 'ko';

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ 
        success: true,
        results: [],
        total: 0
      });
    }

    // 검색 키워드 로깅 (비동기로 처리)
    addSearchKeyword(query.trim()).catch(error => {
      console.error('Error logging search keyword:', error);
    });

    await connectDB();

    // 검색어 정규화
    const searchQuery = query.trim();
    const regexQuery = new RegExp(searchQuery, 'i');

    // 각 컬렉션에서 검색 (병렬 처리)
    const [blogResults, pressResults, productResults, brandStoryResults] = await Promise.all([
      BlogPost.find({
        $and: [
          { is_published: true },
          {
            $or: [
              { 'content.ko.title': regexQuery },
              { 'content.ko.subtitle': regexQuery },
              { 'content.ko.body': regexQuery },
              { 'content.en.title': regexQuery },
              { 'content.en.subtitle': regexQuery },
              { 'content.en.body': regexQuery },
              { tags: { $in: [regexQuery] } }
            ]
          }
        ]
      }).limit(10).sort({ created_at: -1 }),
      
      PressRelease.find({
        $and: [
          { is_active: true },
          {
            $or: [
              { 'content.ko.title': regexQuery },
              { 'content.ko.body': regexQuery },
              { 'content.en.title': regexQuery },
              { 'content.en.body': regexQuery },
              { 'press_name.ko': regexQuery },
              { 'press_name.en': regexQuery }
            ]
          }
        ]
      }).limit(10).sort({ published_date: -1 }),
      
      Product.find({
        $and: [
          { is_active: true },
          {
            $or: [
              { 'content.ko.title': regexQuery },
              { 'content.ko.description': regexQuery },
              { 'content.en.title': regexQuery },
              { 'content.en.description': regexQuery }
            ]
          }
        ]
      }).limit(10).sort({ created_at: -1 }),
      
      BrandStory.find({
        $and: [
          { is_published: true },
          {
            $or: [
              { 'content.ko.title': regexQuery },
              { 'content.ko.subtitle': regexQuery },
              { 'content.ko.body': regexQuery },
              { 'content.en.title': regexQuery },
              { 'content.en.subtitle': regexQuery },
              { 'content.en.body': regexQuery }
            ]
          }
        ]
      }).limit(10).sort({ created_at: -1 })
    ]);

    // 결과를 통합하고 정규화
    const results = [
      ...blogResults.map(item => ({
        type: 'blog',
        slug: item.slug,
        title_ko: item.content?.ko?.title || '',
        title_en: item.content?.en?.title || '',
        subtitle_ko: item.content?.ko?.subtitle || '',
        subtitle_en: item.content?.en?.subtitle || '',
        created_at: item.created_at
      })),
      ...pressResults.map(item => ({
        type: 'press',
        slug: item.slug,
        title_ko: item.content?.ko?.title || '',
        title_en: item.content?.en?.title || '',
        subtitle_ko: item.press_name?.ko || '',
        subtitle_en: item.press_name?.en || '',
        published_date: item.published_date
      })),
      ...productResults.map(item => ({
        type: 'product',
        slug: item.slug,
        title_ko: item.content?.ko?.title || '',
        title_en: item.content?.en?.title || '',
        subtitle_ko: item.content?.ko?.description || '',
        subtitle_en: item.content?.en?.description || '',
        created_at: item.created_at
      })),
      ...brandStoryResults.map(item => ({
        type: 'brand_story',
        slug: item.slug,
        title_ko: item.content?.ko?.title || '',
        title_en: item.content?.en?.title || '',
        subtitle_ko: item.content?.ko?.subtitle || '',
        subtitle_en: item.content?.en?.subtitle || '',
        created_at: item.created_at
      }))
    ];

    // 검색어와의 관련성에 따라 정렬 (제목에 검색어가 포함된 것을 우선)
    results.sort((a, b) => {
      const aTitle = lang === 'en' ? a.title_en : a.title_ko;
      const bTitle = lang === 'en' ? b.title_en : b.title_ko;
      
      const aTitleMatch = aTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const bTitleMatch = bTitle.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return 0;
    });

    return NextResponse.json({ 
      success: true,
      results,
      total: results.length,
      query: searchQuery
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ 
      success: false,
      results: [],
      total: 0,
      error: '검색 중 오류가 발생했습니다.'
    });
  }
} 