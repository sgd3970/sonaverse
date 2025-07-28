import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db';
import BrandStory from '../../../models/BrandStory';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'ko';
    const published = searchParams.get('published');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search')?.trim();

    await dbConnect();

    // 관리자 페이지용 쿼리 (published 파라미터가 있으면 해당 조건으로 필터링)
    let query = {};
    if (published !== null) {
      query = { is_published: published === 'true' };
    }

    // 검색 조건 추가
    if (search) {
      query = {
        ...query,
        $or: [
          { 'content.ko.title': { $regex: search, $options: 'i' } },
          { 'content.en.title': { $regex: search, $options: 'i' } },
          { 'content.ko.subtitle': { $regex: search, $options: 'i' } },
          { 'content.en.subtitle': { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const skip = (page - 1) * pageSize;
    const total = await BrandStory.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize);

    // limit 파라미터가 있으면 pageSize 대신 limit 사용
    const finalLimit = limit ? parseInt(limit) : pageSize;

    const brandStories = await BrandStory.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(finalLimit)
      .select('content slug created_at is_published tags youtube_url');

    return NextResponse.json({
      success: true,
      results: brandStories,
      total,
      page,
      pageSize: finalLimit,
      totalPages
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
    const { slug, content, youtube_url, tags, updated_by, is_published } = body;

    if (!slug || !content) {
      return NextResponse.json(
        { success: false, error: '슬러그와 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // 기존 데이터 확인
    const existingStory = await BrandStory.findOne({ slug });
    if (existingStory) {
      return NextResponse.json(
        { success: false, error: '이미 존재하는 슬러그입니다.' },
        { status: 400 }
      );
    }

    const brandStory = new BrandStory({
      slug,
      content,
      youtube_url,
      tags: tags || [],
      updated_by: updated_by || 'admin',
      is_published: is_published !== undefined ? is_published : true
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