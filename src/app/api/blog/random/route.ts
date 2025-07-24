import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import BlogPost from '../../../../models/BlogPost';

/**
 * 랜덤 블로그 포스트 조회 (GET)
 * 추천 게시물용
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const excludeSlug = searchParams.get('exclude') || '';
    
    // 검색 조건 구성
    const query: any = {
      is_published: true
    };
    
    // 현재 게시물 제외
    if (excludeSlug) {
      query.slug = { $ne: excludeSlug };
    }
    
    // MongoDB의 $sample을 사용하여 랜덤 게시물 가져오기
    const randomPosts = await BlogPost.aggregate([
      { $match: query },
      { $sample: { size: limit } },
      {
        $project: {
          _id: 1,
          slug: 1,
          content: 1,
          created_at: 1,
          tags: 1
        }
      }
    ]);
    
    return NextResponse.json({
      success: true,
      results: randomPosts,
      count: randomPosts.length
    });
    
  } catch (error) {
    console.error('Error fetching random blog posts:', error);
    return NextResponse.json(
      { error: '랜덤 블로그 포스트를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 