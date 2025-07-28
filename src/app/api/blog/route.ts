import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db';
import BlogPost from '../../../models/BlogPost';
import { verifyToken } from '../../../lib/auth-server';

/**
 * 블로그 포스트 목록 조회 (GET)
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    const published = searchParams.get('published') || 'true';
    
    const skip = (page - 1) * limit;
    
    // 검색 조건 구성
    const query: any = {};
    
    // 공개 여부 필터
    if (published === 'true') {
      query.is_published = true;
    }
    
    // 검색어 필터
    if (search) {
      query.$or = [
        { 'content.ko.title': { $regex: search, $options: 'i' } },
        { 'content.en.title': { $regex: search, $options: 'i' } },
        { 'content.ko.subtitle': { $regex: search, $options: 'i' } },
        { 'content.en.subtitle': { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    // 태그 필터
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    // 블로그 포스트 조회 (저장된 username 사용)
    const blogPosts = await BlogPost.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // 전체 개수 조회
    const total = await BlogPost.countDocuments(query);
    
    return NextResponse.json({
      results: blogPosts,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: '블로그 포스트를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 블로그 포스트 생성 (POST)
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 체크
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    // 필수 필드 검증
    if (!body.slug || !body.content) {
      return NextResponse.json(
        { error: '필수 필드를 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 중복 slug 확인
    const existingPost = await BlogPost.findOne({ slug: body.slug });
    if (existingPost) {
      return NextResponse.json(
        { error: '이미 존재하는 슬러그입니다.' },
        { status: 400 }
      );
    }
    
    // 토큰에서 사용자 정보 추출
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }
    
    // 블로그 포스트 생성
    const blogPost = new BlogPost({
      ...body,
      author: decoded.id,
      created_at: new Date(),
      last_updated: new Date()
    });
    
    await blogPost.save();
    
    return NextResponse.json({
      success: true,
      blogPost
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: '블로그 포스트 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 