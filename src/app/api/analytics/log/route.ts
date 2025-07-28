import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import VisitorLog from '../../../../models/VisitorLog';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { page, referrer, userAgent, ip, sessionId, today } = body;

    // 필수 필드 검증
    if (!page || !sessionId) {
      return NextResponse.json({ error: 'Page and sessionId are required' }, { status: 400 });
    }

    // 오늘 날짜의 시작과 끝
    const todayStart = new Date(today);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // 같은 세션에서 오늘 이미 방문 기록이 있는지 확인
    const existingVisit = await VisitorLog.findOne({
      sessionId,
      timestamp: {
        $gte: todayStart,
        $lt: todayEnd
      }
    });

    // 이미 오늘 방문 기록이 있으면 추가 로그를 생성하지 않음
    if (existingVisit) {
      return NextResponse.json({ success: true, message: 'Already visited today' });
    }

    // 방문자 로그 저장 (오늘 처음 방문한 경우만)
    const visitorLog = new VisitorLog({
      page,
      timestamp: new Date(),
      referrer,
      userAgent,
      ip,
      sessionId
    });

    await visitorLog.save();

    return NextResponse.json({ success: true, message: 'New visit logged' });

  } catch (error) {
    console.error('Error logging visitor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 