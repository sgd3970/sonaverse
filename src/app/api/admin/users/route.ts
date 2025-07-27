import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth-server';
import { dbConnect } from '../../../../lib/db';
import AdminUser from '../../../../models/AdminUser';
import { hashPassword, comparePassword } from '../../../../lib/auth-server';

/**
 * GET - 관리자 사용자 목록 조회
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

    // 모든 관리자 사용자 조회 (비밀번호 제외)
    const users = await AdminUser.find({}, '-password').sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      users,
      total: users.length
    });
  } catch (error) {
    console.error('GET /api/admin/users error:', error);
    return NextResponse.json(
      { success: false, error: '사용자 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * POST - 새로운 관리자 사용자 생성
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
    const { username, email, password, role } = body;

    // 입력 검증
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: '사용자명, 이메일, 비밀번호가 필요합니다.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // 이메일 중복 확인
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '이미 존재하는 이메일입니다.' },
        { status: 400 }
      );
    }

    // 새 사용자 생성
    const newUser = new AdminUser({
      username,
      email,
      password,
      role: role || 'admin'
    });

    await newUser.save();

    // 비밀번호 제외하고 반환
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return NextResponse.json({
      success: true,
      message: '관리자 사용자가 성공적으로 생성되었습니다.',
      user: userResponse
    });
  } catch (error) {
    console.error('POST /api/admin/users error:', error);
    return NextResponse.json(
      { success: false, error: '사용자 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * PUT - 관리자 사용자 정보 수정
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
    const { userId, email, username, password, role } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // 사용자 존재 확인
    const existingUser = await AdminUser.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 업데이트할 데이터 준비
    const updateData: any = {};
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (role) updateData.role = role;

    // 비밀번호 변경이 있는 경우 해시화
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { success: false, error: '비밀번호는 최소 8자 이상이어야 합니다.' },
          { status: 400 }
        );
      }
      updateData.password = await hashPassword(password);
    }

    // 이메일 중복 확인 (자신 제외)
    if (email && email !== existingUser.email) {
      const duplicateUser = await AdminUser.findOne({ email });
      if (duplicateUser) {
        return NextResponse.json(
          { success: false, error: '이미 존재하는 이메일입니다.' },
          { status: 400 }
        );
      }
    }

    // 사용자 정보 업데이트
    const updatedUser = await AdminUser.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );

    return NextResponse.json({
      success: true,
      message: '사용자 정보가 성공적으로 수정되었습니다.',
      user: updatedUser
    });
  } catch (error) {
    console.error('PUT /api/admin/users error:', error);
    return NextResponse.json(
      { success: false, error: '사용자 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
} 