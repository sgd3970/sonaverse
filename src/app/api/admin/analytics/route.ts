import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth-server';
import { dbConnect } from '../../../../lib/db';
import BlogPost from '../../../../models/BlogPost';
import PressRelease from '../../../../models/PressRelease';
import BrandStory from '../../../../models/BrandStory';
import VisitorLog from '../../../../models/VisitorLog';
import SearchKeyword from '../../../../models/SearchKeyword';

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const visitorPeriod = searchParams.get('visitorPeriod') || 'daily';
    const keywordPeriod = searchParams.get('keywordPeriod') || 'daily';
    const contentPeriod = searchParams.get('contentPeriod') || 'daily';

    await dbConnect();

    // 기간별 방문자 통계 계산
    const now = new Date();
    const visitors = await calculateVisitorStats(visitorPeriod, now);
    
    // 기간별 검색 키워드 통계
    const keywords = await calculateSearchKeywords(keywordPeriod, now);
    
    // 기간별 콘텐츠 통계
    const content = await calculateContentStats(contentPeriod, now);

    // 디버깅: 전체 데이터 개수 확인
    const [totalBlogs, totalPress, totalBrandStories] = await Promise.all([
      BlogPost.countDocuments(),
      PressRelease.countDocuments(),
      BrandStory.countDocuments()
    ]);

    console.log('📊 전체 데이터 개수:', {
      blogs: totalBlogs,
      press: totalPress,
      brandStories: totalBrandStories
    });

    return NextResponse.json({
      visitors,
      searchKeywords: keywords,
      content,
      totals: {
        blogs: totalBlogs,
        press: totalPress,
        brandStories: totalBrandStories
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 방문자 통계 계산
async function calculateVisitorStats(period: string, now: Date) {
  const trend = [];
  
  if (period === 'daily') {
    // 일간: 최근 7일
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const count = await VisitorLog.countDocuments({
        timestamp: { $gte: startOfDay, $lte: endOfDay }
      });
      
      const displayDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;
      trend.push({ date: displayDate, count });
    }
  } else if (period === 'weekly') {
    // 주간: 최근 4주
    for (let i = 3; i >= 0; i--) {
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - (i * 7));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      
      const count = await VisitorLog.countDocuments({
        timestamp: { $gte: startDate, $lte: endDate }
      });
      
      const weekNumber = Math.ceil((startDate.getDate() + startDate.getDay()) / 7);
      const displayDate = `${startDate.getMonth() + 1}월 ${weekNumber}째 주`;
      trend.push({ date: displayDate, count });
    }
  } else {
    // 월간: 최근 6개월
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth();
      
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0);
      
      const count = await VisitorLog.countDocuments({
        timestamp: { $gte: startOfMonth, $lte: endOfMonth }
      });
      
      const displayDate = `${month + 1}월`;
      trend.push({ date: displayDate, count });
    }
  }
  
  return {
    trend
  };
}

// 검색 키워드 통계 계산
async function calculateSearchKeywords(period: string, now: Date) {
  let cutoffDate: Date;
  
  if (period === 'daily') {
    // 일간: 오늘 하루
    cutoffDate = new Date(now);
    cutoffDate.setHours(0, 0, 0, 0);
  } else if (period === 'weekly') {
    // 주간: 최근 7일
    cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - 7);
  } else {
    // 월간: 최근 30일
    cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - 30);
  }
  
  const keywords = await SearchKeyword.find({
    lastUsed: { $gte: cutoffDate }
  }).sort({ count: -1 }).limit(10);
  
  return keywords.map(keyword => ({
    keyword: keyword.keyword,
    count: keyword.count
  }));
}

// 콘텐츠 통계 계산
async function calculateContentStats(period: string, now: Date) {
  const blogTrend = [];
  const pressTrend = [];
  const brandStoryTrend = [];
  
  if (period === 'daily') {
    // 일간: 최근 7일
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const [blogCount, pressCount, brandStoryCount] = await Promise.all([
        BlogPost.countDocuments({
          created_at: { $gte: startOfDay, $lte: endOfDay },
          is_published: true
        }),
        PressRelease.countDocuments({
          created_at: { $gte: startOfDay, $lte: endOfDay },
          is_active: true
        }),
        BrandStory.countDocuments({
          created_at: { $gte: startOfDay, $lte: endOfDay },
          is_published: true
        })
      ]);
      
      const displayDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;
      blogTrend.push({ date: displayDate, count: blogCount });
      pressTrend.push({ date: displayDate, count: pressCount });
      brandStoryTrend.push({ date: displayDate, count: brandStoryCount });
    }
  } else if (period === 'weekly') {
    // 주간: 최근 4주
    for (let i = 3; i >= 0; i--) {
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - (i * 7));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      
      const [blogCount, pressCount, brandStoryCount] = await Promise.all([
        BlogPost.countDocuments({
          created_at: { $gte: startDate, $lte: endDate },
          is_published: true
        }),
        PressRelease.countDocuments({
          created_at: { $gte: startDate, $lte: endDate },
          is_active: true
        }),
        BrandStory.countDocuments({
          created_at: { $gte: startDate, $lte: endDate },
          is_published: true
        })
      ]);
      
      const weekNumber = Math.ceil((startDate.getDate() + startDate.getDay()) / 7);
      const displayDate = `${startDate.getMonth() + 1}월 ${weekNumber}째 주`;
      blogTrend.push({ date: displayDate, count: blogCount });
      pressTrend.push({ date: displayDate, count: pressCount });
      brandStoryTrend.push({ date: displayDate, count: brandStoryCount });
    }
  } else {
    // 월간: 최근 6개월
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth();
      
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0);
      
      const [blogCount, pressCount, brandStoryCount] = await Promise.all([
        BlogPost.countDocuments({
          created_at: { $gte: startOfMonth, $lte: endOfMonth },
          is_published: true
        }),
        PressRelease.countDocuments({
          created_at: { $gte: startOfMonth, $lte: endOfMonth },
          is_active: true
        }),
        BrandStory.countDocuments({
          created_at: { $gte: startOfMonth, $lte: endOfMonth },
          is_published: true
        })
      ]);
      
      const displayDate = `${month + 1}월`;
      blogTrend.push({ date: displayDate, count: blogCount });
      pressTrend.push({ date: displayDate, count: pressCount });
      brandStoryTrend.push({ date: displayDate, count: brandStoryCount });
    }
  }
  
  return {
    blog: blogTrend,
    press: pressTrend,
    brandStory: brandStoryTrend
  };
} 