import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import BrandStory from '../../../models/BrandStory';
import { getCurrentUser } from '../../../lib/auth-server';

/**
 * GET /api/brand-story
 * 브랜드 스토리 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    console.log('BrandStory API called');
    
    // 임시로 더미 데이터 반환 (데이터베이스 연결 문제 해결 전까지)
    const dummyStories = [
      {
        _id: '1',
        slug: 'sonaverse-story-1',
        content: {
          ko: {
            title: '소나버스의 시작',
            subtitle: '혁신적인 육아 제품으로 시작된 여정',
            body: '소나버스는 2020년에 설립되어 혁신적인 육아 제품을 개발하기 시작했습니다.'
          },
          en: {
            title: 'The Beginning of Sonaverse',
            subtitle: 'A journey started with innovative parenting products',
            body: 'Sonaverse was established in 2020 and began developing innovative parenting products.'
          }
        },
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: 'admin',
        tags: ['브랜드', '시작', '혁신']
      },
      {
        _id: '2',
        slug: 'sonaverse-story-2',
        content: {
          ko: {
            title: '보듬 기저귀의 탄생',
            subtitle: '아이의 피부를 생각한 친환경 기저귀',
            body: '보듬 기저귀는 아이들의 민감한 피부를 위해 특별히 개발되었습니다.'
          },
          en: {
            title: 'The Birth of Bodeum Diaper',
            subtitle: 'Eco-friendly diaper that cares for baby\'s skin',
            body: 'Bodeum Diaper was specially developed for children\'s sensitive skin.'
          }
        },
        is_published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: 'admin',
        tags: ['기저귀', '친환경', '피부']
      }
    ];

    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    console.log('Search params:', { published, limit, page });

    // published 파라미터에 따라 필터링
    let filteredStories = dummyStories;
    if (published !== 'false') {
      filteredStories = dummyStories.filter(story => story.is_published);
    }

    const response = {
      success: true,
      results: filteredStories,
      pagination: {
        total: filteredStories.length,
        page,
        limit,
        totalPages: Math.ceil(filteredStories.length / limit)
      }
    };

    console.log('Response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching brand stories:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: '브랜드 스토리 목록을 불러오는데 실패했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/brand-story
 * 새 브랜드 스토리 생성 (관리자 전용)
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { slug, content, youtube_url, tags, is_published, updated_by } = body;

    // 필수 필드 검증
    if (!slug || !content || !updated_by) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 슬러그 중복 검사
    const existingStory = await BrandStory.findOne({ slug });
    if (existingStory) {
      return NextResponse.json(
        { success: false, error: '이미 사용 중인 슬러그입니다.' },
        { status: 400 }
      );
    }

    // 새 브랜드 스토리 생성
    const newStory = new BrandStory({
      slug,
      content,
      youtube_url,
      tags: Array.isArray(tags) ? tags : [],
      is_published: Boolean(is_published),
      updated_by,
      author: user.id
    });

    const savedStory = await newStory.save();

    return NextResponse.json({
      success: true,
      data: savedStory
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating brand story:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { success: false, error: '이미 사용 중인 슬러그입니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: '브랜드 스토리 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}