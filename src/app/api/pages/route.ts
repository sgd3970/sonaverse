import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db';
import Page from '../../../models/Page';

/**
 * 페이지 목록 조회 및 새 페이지 생성 API
 */
export async function GET() {
  try {
    await dbConnect();
    const pages = await Page.find({}).sort({ updated_at: -1 });
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: '페이지 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const page = new Page(body);
    await page.save();
    
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: '페이지 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 