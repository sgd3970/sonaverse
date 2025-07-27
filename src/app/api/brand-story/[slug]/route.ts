import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import BrandStory from '../../../../models/BrandStory';
import { getCurrentUser } from '../../../../lib/auth-server';

/**
 * GET /api/brand-story/[slug]
 * 특정 브랜드 스토리 조회
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('BrandStory detail API called for slug:', params.slug);

    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: '슬러그가 필요합니다.' },
        { status: 400 }
      );
    }

    // 임시 더미 데이터 (데이터베이스 연결 문제 해결 전까지)
    const dummyStories = {
      'sonaverse-story-1': {
        _id: '1',
        slug: 'sonaverse-story-1',
        content: {
          ko: {
            title: '소나버스의 시작',
            subtitle: '혁신적인 육아 제품으로 시작된 여정',
            body: '소나버스는 2020년에 설립되어 혁신적인 육아 제품을 개발하기 시작했습니다. 우리의 첫 번째 제품인 만보 보행기는 아이들의 안전과 발달을 고려하여 설계되었습니다.',
            thumbnail_url: '',
            images: []
          },
          en: {
            title: 'The Beginning of Sonaverse',
            subtitle: 'A journey started with innovative parenting products',
            body: 'Sonaverse was established in 2020 and began developing innovative parenting products. Our first product, the Manbo Walker, was designed with children\'s safety and development in mind.',
            thumbnail_url: '',
            images: []
          }
        },
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: 'admin',
        tags: ['브랜드', '시작', '혁신'],
        youtube_url: ''
      },
      'sonaverse-story-2': {
        _id: '2',
        slug: 'sonaverse-story-2',
        content: {
          ko: {
            title: '보듬 기저귀의 탄생',
            subtitle: '아이의 피부를 생각한 친환경 기저귀',
            body: '보듬 기저귀는 아이들의 민감한 피부를 위해 특별히 개발되었습니다. 천연 소재를 사용하여 피부 자극을 최소화하고, 친환경적인 제품으로 환경도 함께 생각합니다.',
            thumbnail_url: '',
            images: []
          },
          en: {
            title: 'The Birth of Bodeum Diaper',
            subtitle: 'Eco-friendly diaper that cares for baby\'s skin',
            body: 'Bodeum Diaper was specially developed for children\'s sensitive skin. Using natural materials to minimize skin irritation, it\'s an eco-friendly product that also considers the environment.',
            thumbnail_url: '',
            images: []
          }
        },
        is_published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: 'admin',
        tags: ['기저귀', '친환경', '피부'],
        youtube_url: ''
      }
    };

    const story = dummyStories[slug as keyof typeof dummyStories];

    if (!story) {
      return NextResponse.json(
        { success: false, error: '브랜드 스토리를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log('Returning story:', story);
    return NextResponse.json(story);

  } catch (error) {
    console.error('Error fetching brand story:', error);
    return NextResponse.json(
      { success: false, error: '브랜드 스토리를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/brand-story/[slug]
 * 브랜드 스토리 부분 수정 (관리자 전용)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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

    const { slug } = params;
    const updates = await request.json();

    if (!slug) {
      return NextResponse.json(
        { success: false, error: '슬러그가 필요합니다.' },
        { status: 400 }
      );
    }

    // 허용된 업데이트 필드만 추출
    const allowedUpdates = ['content', 'youtube_url', 'tags', 'is_published'];
    const validUpdates: any = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        validUpdates[key] = updates[key];
      }
    });

    // updated_by와 updated_at 자동 설정
    validUpdates.updated_by = user.username || user.email;
    validUpdates.updated_at = new Date();
    validUpdates.last_updated = new Date();

    // 브랜드 스토리 업데이트
    const updatedStory = await BrandStory.findOneAndUpdate(
      { slug },
      { $set: validUpdates },
      { new: true, runValidators: true }
    );

    if (!updatedStory) {
      return NextResponse.json(
        { success: false, error: '브랜드 스토리를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedStory
    });

  } catch (error) {
    console.error('Error updating brand story:', error);
    return NextResponse.json(
      { success: false, error: '브랜드 스토리 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/brand-story/[slug]
 * 브랜드 스토리 삭제 (관리자 전용)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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

    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: '슬러그가 필요합니다.' },
        { status: 400 }
      );
    }

    // 브랜드 스토리 삭제
    const deletedStory = await BrandStory.findOneAndDelete({ slug });

    if (!deletedStory) {
      return NextResponse.json(
        { success: false, error: '브랜드 스토리를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '브랜드 스토리가 삭제되었습니다.'
    });

  } catch (error) {
    console.error('Error deleting brand story:', error);
    return NextResponse.json(
      { success: false, error: '브랜드 스토리 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}