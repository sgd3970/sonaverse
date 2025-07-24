import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import BlogPost from '../../../../models/BlogPost';

/**
 * 개별 블로그 포스트 조회, 수정, 삭제 API
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const post = await BlogPost.findById(params.id);
    
    if (!post) {
      return NextResponse.json(
        { error: '블로그 포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: '블로그 포스트를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const post = await BlogPost.findByIdAndUpdate(
      params.id,
      { ...body, updated_at: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return NextResponse.json(
        { error: '블로그 포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: '블로그 포스트 수정에 실패했습니다.' },
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
    const post = await BlogPost.findByIdAndDelete(params.id);
    
    if (!post) {
      return NextResponse.json(
        { error: '블로그 포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: '블로그 포스트가 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: '블로그 포스트 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 