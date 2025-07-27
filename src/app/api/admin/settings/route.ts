import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth-server';
import { connectDB } from '../../../../lib/db';
import AdminSetting from '../../../../models/AdminSetting';

/**
 * GET - 사이트 설정 조회
 */
export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    await connectDB();

    // 모든 설정 조회
    const settings = await AdminSetting.find({}).sort({ key: 1 });
    
    // 설정을 객체로 변환
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      success: true,
      settings: settingsObject,
      total: settings.length
    });
  } catch (error) {
    console.error('GET /api/admin/settings error:', error);
    return NextResponse.json(
      { success: false, error: '설정을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * POST - 사이트 설정 생성/수정
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: '설정 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    await connectDB();

    // 각 설정을 저장/업데이트
    const results = [];
    for (const [key, value] of Object.entries(settings)) {
      try {
        const setting = await AdminSetting.findOneAndUpdate(
          { key },
          { key, value },
          { upsert: true, new: true }
        );
        results.push(setting);
      } catch (error) {
        console.error(`Error updating setting ${key}:`, error);
        results.push({ key, error: '업데이트 실패' });
      }
    }

    return NextResponse.json({
      success: true,
      message: '설정이 성공적으로 저장되었습니다.',
      results
    });
  } catch (error) {
    console.error('POST /api/admin/settings error:', error);
    return NextResponse.json(
      { success: false, error: '설정 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * PUT - 사이트 설정 전체 업데이트
 */
export async function PUT(request: NextRequest) {
  try {
    // 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: '설정 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    await connectDB();

    // 기존 설정 모두 삭제
    await AdminSetting.deleteMany({});

    // 새로운 설정들 저장
    const newSettings = [];
    for (const [key, value] of Object.entries(settings)) {
      const setting = new AdminSetting({ key, value });
      await setting.save();
      newSettings.push(setting);
    }

    return NextResponse.json({
      success: true,
      message: '설정이 성공적으로 업데이트되었습니다.',
      settings: newSettings
    });
  } catch (error) {
    console.error('PUT /api/admin/settings error:', error);
    return NextResponse.json(
      { success: false, error: '설정 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
} 