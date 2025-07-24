import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 없습니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '이미지 파일만 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 5MB 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 임시로 로컬 URL 반환 (실제 배포 시에는 Vercel Blob 사용)
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    
    // 실제 구현에서는 Vercel Blob을 사용해야 함
    // const blob = await put(fileName, file, { access: 'public' });
    
    // 임시 URL (실제로는 blob.url을 사용)
    const tempUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      url: tempUrl,
      success: true
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 