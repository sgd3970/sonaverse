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
    // 임시로 인증 비활성화 (디버깅용)
    // const user = await getCurrentUser();
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // 임시로 더미 데이터 반환 (디버깅용)
    return NextResponse.json({
      totalBlog: 5,
      totalPress: 3,
      totalBrandStories: 2,
      totalInquiries: 8,
      totalVisitors: 150,
      totalPageViews: 450,
      recentPosts: [
        {
          type: 'blog',
          title: '샘플 블로그 포스트',
          slug: 'sample-blog',
          created_at: new Date().toISOString()
        }
      ]
    });

  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

 