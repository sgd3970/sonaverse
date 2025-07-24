import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db';
import BlogPost from '../../../models/BlogPost';

/**
 * 블로그 포스트 목록 조회 및 새 포스트 생성 API
 */
export async function GET() {
  try {
    await dbConnect();
    const posts = await BlogPost.find({}).sort({ published_date: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: '블로그 포스트 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const post = new BlogPost(body);
    await post.save();
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: '블로그 포스트 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 