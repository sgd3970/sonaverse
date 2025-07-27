import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import PressRelease from '../../../../models/PressRelease';
import { verifyToken } from '../../../../lib/auth-server';

/**
 * GET: 특정 언론보도 상세 정보 조회
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'ko';
    
    const resolvedParams = await params;
    const pressRelease = await PressRelease.findOne({ 
      slug: resolvedParams.slug,
      is_active: true 
    });
    
    if (!pressRelease) {
      return NextResponse.json(
        { error: '해당 언론보도를 찾을 수 없습니다.' }, 
        { status: 404 }
      );
    }
    
    // 언어별 데이터만 추출
    const result = {
      slug: pressRelease.slug,
      published_date: pressRelease.published_date,
      press_name: pressRelease.press_name[lang] || pressRelease.press_name['ko'],
      title: pressRelease.content[lang]?.title || pressRelease.content['ko']?.title,
      body: pressRelease.content[lang]?.body || pressRelease.content['ko']?.body,
      external_link: pressRelease.content[lang]?.external_link || pressRelease.content['ko']?.external_link,
      is_active: pressRelease.is_active,
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching press release:', error);
    return NextResponse.json(
      { error: '언론보도 상세 정보를 가져오는데 실패했습니다.' }, 
      { status: 500 }
    );
  }
}

/**
 * PATCH: 언론보도 수정 (활성화/비활성화 상태 변경)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 인증 체크
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const body = await request.json();
    
    const updateData: any = {};
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.published_date) updateData.published_date = new Date(body.published_date);
    if (body.press_name) updateData.press_name = body.press_name;
    if (body.content) updateData.content = body.content;
    updateData.last_updated = new Date();
    
    const pressRelease = await PressRelease.findOneAndUpdate(
      { slug: resolvedParams.slug },
      updateData,
      { new: true }
    );
    
    if (!pressRelease) {
      return NextResponse.json(
        { error: '해당 언론보도를 찾을 수 없습니다.' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, press: pressRelease });
  } catch (error) {
    console.error('Error updating press release:', error);
    return NextResponse.json(
      { error: '언론보도 수정에 실패했습니다.' }, 
      { status: 500 }
    );
  }
}

/**
 * DELETE: 언론보도 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 인증 체크
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    
    const pressRelease = await PressRelease.findOneAndDelete({ slug: resolvedParams.slug });
    
    if (!pressRelease) {
      return NextResponse.json(
        { error: '해당 언론보도를 찾을 수 없습니다.' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting press release:', error);
    return NextResponse.json(
      { error: '언론보도 삭제에 실패했습니다.' }, 
      { status: 500 }
    );
  }
} 