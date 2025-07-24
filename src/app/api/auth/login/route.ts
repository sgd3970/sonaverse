import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import AdminUser from '../../../../models/AdminUser';
import { comparePassword, generateToken } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    // 필수 필드 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' }, 
        { status: 400 }
      );
    }

    // 사용자 조회
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, 
        { status: 401 }
      );
    }

    // 계정 활성화 확인
    if (!user.is_active) {
      return NextResponse.json(
        { error: '비활성화된 계정입니다.' }, 
        { status: 401 }
      );
    }

    // 비밀번호 검증
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, 
        { status: 401 }
      );
    }

    // 마지막 로그인 시간 업데이트
    user.last_login_at = new Date();
    await user.save();

    // JWT 토큰 생성
    const token = generateToken({
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '로그인 중 오류가 발생했습니다.' }, 
      { status: 500 }
    );
  }
} 