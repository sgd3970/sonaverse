import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db';
import PressRelease from '../../../models/PressRelease';
import { verifyToken } from '../../../lib/auth';
import mongoose from 'mongoose';

/**
 * GET: 언론보도 목록 조회 (lang, page, search 파라미터로 다국어/페이지네이션/검색 지원)
 * POST: 새 언론보도 등록 (관리자 인증 필요)
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'ko';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = 10;
    const search = searchParams.get('search')?.trim();
    const isActive = searchParams.get('active') !== 'false';

    const query: any = isActive ? { is_active: true } : {};
    
    // 검색 조건 추가 (제목/언론사명/본문)
    if (search) {
      query.$or = [
        { [`content.${lang}.title`]: { $regex: search, $options: 'i' } },
        { [`press_name.${lang}`]: { $regex: search, $options: 'i' } },
        { [`content.${lang}.body`]: { $regex: search, $options: 'i' } },
      ];
    }
    
    const total = await PressRelease.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize);
    const pressReleases = await PressRelease.find(query)
      .sort({ published_date: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    
    // 언어별 데이터만 추출
    const result = pressReleases.map((item: any) => ({
      slug: item.slug,
      published_date: item.published_date,
      press_name: item.press_name[lang] || item.press_name['ko'],
      title: item.content[lang]?.title || item.content['ko']?.title,
      summary: item.content[lang]?.body?.slice(0, 120) || '',
      external_link: item.content[lang]?.external_link || '',
      is_active: item.is_active,
    }));
    
    return NextResponse.json({
      total,
      page,
      pageSize,
      totalPages,
      results: result,
    });
  } catch (error) {
    console.error('Error fetching press releases:', error);
    return NextResponse.json({ error: '언론보도 목록을 가져오는데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 인증 체크
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }
    await dbConnect();
    const body = await request.json();
    // 필수 필드 검증
    if (!body.slug || !body.published_date || !body.press_name || !body.content || !body.updated_by) {
      return NextResponse.json({ error: '필수 입력값이 누락되었습니다.' }, { status: 400 });
    }
    const newPress = await PressRelease.create({
      slug: body.slug,
      published_date: new Date(body.published_date),
      press_name: body.press_name,
      content: body.content,
      updated_by: body.updated_by,
      is_active: body.is_active !== false,
    });
    return NextResponse.json({ success: true, press: newPress });
  } catch (error) {
    console.error('Error creating press release:', error);
    return NextResponse.json({ error: '언론보도 등록에 실패했습니다.' }, { status: 500 });
  }
} 