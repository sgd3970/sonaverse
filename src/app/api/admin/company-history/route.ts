import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth-server';
import { dbConnect } from '../../../../lib/db';
import CompanyHistory from '../../../../models/CompanyHistory';

/**
 * GET - 회사 연혁 목록 조회
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

    await dbConnect();

    // 모든 회사 연혁 조회 (날짜순 정렬)
    const history = await CompanyHistory.find({}).sort({ year: -1, month: -1 });

    return NextResponse.json({
      success: true,
      history,
      total: history.length
    });
  } catch (error) {
    console.error('GET /api/admin/company-history error:', error);
    return NextResponse.json(
      { success: false, error: '회사 연혁을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * POST - 새로운 회사 연혁 생성
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
    const { year, month, content } = body;

    // 입력 검증
    if (!year || !content) {
      return NextResponse.json(
        { success: false, error: '연도와 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    if (year < 1900 || year > new Date().getFullYear() + 10) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 연도입니다.' },
        { status: 400 }
      );
    }

    if (month && (month < 1 || month > 12)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 월입니다.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // 새 연혁 생성
    const newHistory = new CompanyHistory({
      year,
      month: month || null,
      content
    });

    await newHistory.save();

    return NextResponse.json({
      success: true,
      message: '회사 연혁이 성공적으로 생성되었습니다.',
      history: newHistory
    });
  } catch (error) {
    console.error('POST /api/admin/company-history error:', error);
    return NextResponse.json(
      { success: false, error: '회사 연혁 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * PUT - 회사 연혁 수정
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
    const { historyId, year, month, content } = body;

    if (!historyId) {
      return NextResponse.json(
        { success: false, error: '연혁 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // 연혁 존재 확인
    const existingHistory = await CompanyHistory.findById(historyId);
    if (!existingHistory) {
      return NextResponse.json(
        { success: false, error: '연혁을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 업데이트할 데이터 준비
    const updateData: any = {};
    if (year !== undefined) {
      if (year < 1900 || year > new Date().getFullYear() + 10) {
        return NextResponse.json(
          { success: false, error: '유효하지 않은 연도입니다.' },
          { status: 400 }
        );
      }
      updateData.year = year;
    }
    if (month !== undefined) {
      if (month && (month < 1 || month > 12)) {
        return NextResponse.json(
          { success: false, error: '유효하지 않은 월입니다.' },
          { status: 400 }
        );
      }
      updateData.month = month || null;
    }
    if (content !== undefined) updateData.content = content;

    // 연혁 정보 업데이트
    const updatedHistory = await CompanyHistory.findByIdAndUpdate(
      historyId,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: '회사 연혁이 성공적으로 수정되었습니다.',
      history: updatedHistory
    });
  } catch (error) {
    console.error('PUT /api/admin/company-history error:', error);
    return NextResponse.json(
      { success: false, error: '회사 연혁 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - 회사 연혁 삭제
 */
export async function DELETE(request: NextRequest) {
  try {
    // 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const historyId = searchParams.get('id');

    if (!historyId) {
      return NextResponse.json(
        { success: false, error: '연혁 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // 연혁 존재 확인
    const existingHistory = await CompanyHistory.findById(historyId);
    if (!existingHistory) {
      return NextResponse.json(
        { success: false, error: '연혁을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 연혁 삭제
    await CompanyHistory.findByIdAndDelete(historyId);

    return NextResponse.json({
      success: true,
      message: '회사 연혁이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('DELETE /api/admin/company-history error:', error);
    return NextResponse.json(
      { success: false, error: '회사 연혁 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 