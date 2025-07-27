import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import BlogPost from '../../../../models/BlogPost';
import { verifyToken } from '../../../../lib/auth-server';

/**
 * 블로그 포스트 상세 조회 (GET)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const blogPost = await BlogPost.findOne({ slug })
      .lean();

    if (!blogPost) {
      return NextResponse.json(
        { error: '블로그 포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: '블로그 포스트를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 블로그 포스트 수정 (PATCH)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 인증 체크
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const body = await request.json();

    const blogPost = await BlogPost.findOneAndUpdate(
      { slug },
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
 * 블로그 포스트 삭제 (DELETE)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 인증 체크
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const blogPost = await BlogPost.findOneAndDelete({ slug });

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