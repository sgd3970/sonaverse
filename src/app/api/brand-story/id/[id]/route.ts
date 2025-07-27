import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
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

/**
 * DELETE /api/brand-story/id/[id]
 * ID로 브랜드 스토리 삭제 (관리자 전용)
 */
export async function DELETE(
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 브랜드 스토리 삭제
    const deletedStory = await BrandStory.findByIdAndDelete(id);

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