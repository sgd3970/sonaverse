import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import VisitorLog from '../../../../models/VisitorLog';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { page, referrer, userAgent, ip, sessionId } = body;

    // 필수 필드 검증
    if (!page) {
      return NextResponse.json({ error: 'Page is required' }, { status: 400 });
    }

    // 방문자 로그 저장
    const visitorLog = new VisitorLog({
      page,
      timestamp: new Date(),
      referrer,
      userAgent,
      ip,
      sessionId
    });

    await visitorLog.save();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error logging visitor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 