import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import AdminUser from '../../../../models/AdminUser';
import { generateToken, comparePassword } from '../../../../lib/auth';

/**
 * 관리자 로그인 API
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { username, password } = await request.json();

    // 입력 검증
    if (!username || !password) {
      return NextResponse.json(
        { error: '사용자명과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 사용자 조회
    const user = await AdminUser.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: '잘못된 사용자명 또는 비밀번호입니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 검증
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '잘못된 사용자명 또는 비밀번호입니다.' },
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const token = generateToken({
      id: user._id,
      username: user.username,
      role: user.role
    });

    // 마지막 로그인 시간 업데이트
    await AdminUser.findByIdAndUpdate(user._id, {
      last_login: new Date()
    });

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '로그인에 실패했습니다.' },
      { status: 500 }
    );
  }
} 