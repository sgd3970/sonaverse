import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db';
import BrandStory from '../../../models/BrandStory';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'ko';

    await dbConnect();

    const brandStories = await BrandStory.find({ is_published: true })
      .sort({ created_at: -1 })
      .select(`content.${lang} slug created_at`);

    return NextResponse.json({
      success: true,
      brandStories
    });
  } catch (error) {
    console.error('GET /api/brand-story error:', error);
    return NextResponse.json(
      { success: false, error: '브랜드 스토리를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, content, youtube_url, tags, updated_by } = body;

    if (!slug || !content) {
      return NextResponse.json(
        { success: false, error: '슬러그와 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const brandStory = new BrandStory({
      slug,
      content,
      youtube_url,
      tags: tags || [],
      updated_by: updated_by || 'admin',
      is_published: true
    });

    await brandStory.save();

    return NextResponse.json({
      success: true,
      message: '브랜드 스토리가 성공적으로 생성되었습니다.',
      brandStory
    });
  } catch (error) {
    console.error('POST /api/brand-story error:', error);
    return NextResponse.json(
      { success: false, error: '브랜드 스토리 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}