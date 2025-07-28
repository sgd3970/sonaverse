import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import PressRelease from '@/models/PressRelease';
import BrandStory from '@/models/BrandStory';
import DiaperProduct from '@/models/DiaperProduct';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: '슬러그가 필요합니다.' },
        { status: 400 }
      );
    }

    // 모든 컬렉션에서 slug 확인
    const [blogPost, pressRelease, brandStory, diaperProduct] = await Promise.all([
      BlogPost.findOne({ slug }),
      PressRelease.findOne({ slug }),
      BrandStory.findOne({ slug }),
      DiaperProduct.findOne({ slug })
    ]);

    const results = {
      blog: blogPost ? { exists: true, title: blogPost.title?.ko || blogPost.title?.en || '제목 없음' } : { exists: false },
      press: pressRelease ? { exists: true, title: pressRelease.title?.ko || pressRelease.title?.en || '제목 없음' } : { exists: false },
      brandStory: brandStory ? { exists: true, title: brandStory.title?.ko || brandStory.title?.en || '제목 없음' } : { exists: false },
      product: diaperProduct ? { exists: true, title: diaperProduct.name?.ko || diaperProduct.name?.en || '제품명 없음' } : { exists: false }
    };

    const hasConflict = results.blog.exists || results.press.exists || results.brandStory.exists || results.product.exists;

    return NextResponse.json({
      slug,
      hasConflict,
      results
    });

  } catch (error) {
    console.error('Slug check error:', error);
    return NextResponse.json(
      { error: '슬러그 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 