import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import BrandStory from '../../../../models/BrandStory';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await dbConnect();

    const brandStory = await BrandStory.findOne({ slug: slug });

    if (!brandStory) {
      return NextResponse.json(
        { success: false, error: '브랜드 스토리를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ...brandStory.toObject()
    });
  } catch (error) {
    console.error('GET /api/brand-story/[slug] error:', error);
    return NextResponse.json(
      { success: false, error: '브랜드 스토리를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { content, youtube_url, tags, is_published } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, error: '내용이 필요합니다.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const brandStory = await BrandStory.findOneAndUpdate(
      { slug: slug },
      {
        content,
        youtube_url,
        tags: tags || [],
        is_published: is_published !== undefined ? is_published : true,
        updated_by: 'admin'
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
    console.error('PUT /api/brand-story/[slug] error:', error);
    return NextResponse.json(
      { success: false, error: '브랜드 스토리 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await dbConnect();

    const brandStory = await BrandStory.findOneAndDelete({ slug: slug });

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
    console.error('DELETE /api/brand-story/[slug] error:', error);
    return NextResponse.json(
      { success: false, error: '브랜드 스토리 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}