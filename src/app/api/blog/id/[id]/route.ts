import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/db';
import BlogPost from '../../../../../models/BlogPost';
import { getCurrentUser } from '../../../../../lib/auth-server';

/**
 * 블로그 포스트 수정 (PATCH) - ID로 조회
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 체크
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const blogPost = await BlogPost.findByIdAndUpdate(
      id,
      {
        ...body,
        last_updated: new Date()
      },
      { new: true }
    );

    if (!blogPost) {
      return NextResponse.json(
        { error: '블로그 포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: '블로그 포스트 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 블로그 포스트 삭제 (DELETE) - ID로 조회
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 체크
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const blogPost = await BlogPost.findByIdAndDelete(id);

    if (!blogPost) {
      return NextResponse.json(
        { error: '블로그 포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: '블로그 포스트 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}