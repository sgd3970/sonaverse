import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/db';
import BrandStory from '../../../../../models/BrandStory';
import { getCurrentUser } from '../../../../../lib/auth-server';

/**
 * PATCH /api/brand-story/id/[id]
 * ID로 브랜드 스토리 부분 수정 (관리자 전용)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;
    const updates = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID가 필요합니다.' },
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
    const updatedStory = await BrandStory.findByIdAndUpdate(
      id,
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const brandStory = await BrandStory.findById(params.id);

    if (!brandStory) {
      return NextResponse.json(
        { success: false, error: '브랜드 스토리를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      brandStory
    });
  } catch (error) {
    console.error('GET /api/brand-story/id/[id] error:', error);
    return NextResponse.json(
      { success: false, error: '브랜드 스토리를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, excerpt, content, image, is_active } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '제목과 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const brandStory = await BrandStory.findByIdAndUpdate(
      params.id,
      {
        title,
        excerpt,
        content,
        image,
        is_active: is_active !== undefined ? is_active : true
      },
      { new: true }
    );

    if (!brandStory) {
      return NextResponse.json(
        { success: false, error: '브랜드 스토리를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '브랜드 스토리가 성공적으로 수정되었습니다.',
      brandStory
    });
  } catch (error) {
    console.error('PUT /api/brand-story/id/[id] error:', error);
    return NextResponse.json(
      { success: false, error: '브랜드 스토리 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const brandStory = await BrandStory.findByIdAndDelete(params.id);

    if (!brandStory) {
      return NextResponse.json(
        { success: false, error: '브랜드 스토리를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '브랜드 스토리가 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('DELETE /api/brand-story/id/[id] error:', error);
    return NextResponse.json(
      { success: false, error: '브랜드 스토리 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}