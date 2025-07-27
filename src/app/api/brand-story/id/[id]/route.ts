import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/db';
import BrandStory from '../../../../../models/BrandStory';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const brandStory = await BrandStory.findById(id);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      id,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const brandStory = await BrandStory.findByIdAndDelete(id);

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