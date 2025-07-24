import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db';
import Inquiry from '../../../models/Inquiry';

/**
 * 문의 목록 조회 및 새 문의 생성 API
 */
export async function GET() {
  try {
    await dbConnect();
    const inquiries = await Inquiry.find({}).sort({ submitted_at: -1 });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: '문의 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const inquiry = new Inquiry(body);
    await inquiry.save();
    
    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: '문의 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 