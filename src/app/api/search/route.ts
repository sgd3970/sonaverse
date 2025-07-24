import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db';
import Product from '../../../models/Product';
import BlogPost from '../../../models/BlogPost';
import PressRelease from '../../../models/PressRelease';
import BrandStory from '../../../models/BrandStory';

/**
 * 사이트 전체 검색 API
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const lang = searchParams.get('lang') || 'ko';

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const searchRegex = new RegExp(query, 'i');

    // 각 컬렉션에서 검색
    const [products, blogPosts, pressReleases, brandStories] = await Promise.all([
      Product.find({
        $or: [
          { [`name.${lang}`]: searchRegex },
          { [`description.${lang}`]: searchRegex },
          { [`category.${lang}`]: searchRegex }
        ]
      }).limit(10),
      BlogPost.find({
        $or: [
          { [`title.${lang}`]: searchRegex },
          { [`summary.${lang}`]: searchRegex },
          { [`content.${lang}`]: searchRegex }
        ]
      }).limit(10),
      PressRelease.find({
        $or: [
          { [`title.${lang}`]: searchRegex },
          { [`summary.${lang}`]: searchRegex },
          { [`content.${lang}`]: searchRegex }
        ]
      }).limit(10),
      BrandStory.find({
        $or: [
          { [`title.${lang}`]: searchRegex },
          { [`summary.${lang}`]: searchRegex },
          { [`content.${lang}`]: searchRegex }
        ]
      }).limit(10)
    ]);

    // 결과를 타입별로 분류
    const results = [
      ...products.map(item => ({ ...item.toObject(), type: 'product' })),
      ...blogPosts.map(item => ({ ...item.toObject(), type: 'blog' })),
      ...pressReleases.map(item => ({ ...item.toObject(), type: 'press' })),
      ...brandStories.map(item => ({ ...item.toObject(), type: 'brand_story' }))
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: '검색에 실패했습니다.' },
      { status: 500 }
    );
  }
} 