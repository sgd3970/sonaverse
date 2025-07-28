import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth-server';
import { dbConnect } from '../../../../lib/db';
import BlogPost from '../../../../models/BlogPost';
import PressRelease from '../../../../models/PressRelease';
import BrandStory from '../../../../models/BrandStory';
import Inquiry from '../../../../models/Inquiry';
import VisitorLog from '../../../../models/VisitorLog';

export async function GET(request: NextRequest) {
  try {
    // 인증 체크
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // 실제 데이터베이스에서 통계 가져오기
    const [
      totalBlog,
      totalPress,
      totalBrandStories,
      totalInquiries,
      totalVisitors,
      recentBlogPosts,
      recentPressReleases,
      recentBrandStories
    ] = await Promise.all([
      BlogPost.countDocuments(),
      PressRelease.countDocuments(),
      BrandStory.countDocuments(),
      Inquiry.countDocuments(),
      // 고유 방문자 수 계산 (세션 ID 기반)
      VisitorLog.aggregate([
        {
          $group: {
            _id: '$sessionId',
            count: { $sum: 1 }
          }
        },
        {
          $count: 'uniqueVisitors'
        }
      ]),
      BlogPost.find().sort({ created_at: -1 }).limit(3).select('content slug created_at'),
      PressRelease.find().sort({ created_at: -1 }).limit(3).select('content slug created_at'),
      BrandStory.find().sort({ created_at: -1 }).limit(3).select('content slug created_at')
    ]);

    // 최근 게시물 통합
    const recentPosts = [
      ...recentBlogPosts.map(post => ({
        type: 'blog',
        title: post.content?.ko?.title || post.content?.en?.title || '제목 없음',
        slug: post.slug,
        created_at: post.created_at
      })),
      ...recentPressReleases.map(post => ({
        type: 'press',
        title: post.content?.ko?.title || post.content?.en?.title || '제목 없음',
        slug: post.slug,
        created_at: post.created_at
      })),
      ...recentBrandStories.map(post => ({
        type: 'brand-story',
        title: post.content?.ko?.title || post.content?.en?.title || '제목 없음',
        slug: post.slug,
        created_at: post.created_at
      }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

    return NextResponse.json({
      totalBlog,
      totalPress,
      totalBrandStories,
      totalInquiries,
      totalVisitors: totalVisitors[0]?.uniqueVisitors || 0,
      recentPosts
    });

  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

 