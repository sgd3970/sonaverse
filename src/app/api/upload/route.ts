import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const customFilename = formData.get('filename') as string;
    const type = formData.get('type') as string; // 'thumbnail', 'editor', 'general'

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

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 10MB 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 파일명 생성
    let fileName: string;
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';

    if (customFilename) {
      // 커스텀 파일명 사용 (예: slug_thumbnail)
      fileName = `${customFilename}.${fileExtension}`;
    } else if (type === 'editor') {
      // 에디터용 이미지 (예: blog_content_1234567890)
      fileName = `blog_content_${timestamp}.${fileExtension}`;
    } else {
      // 일반 업로드
      fileName = `upload_${timestamp}_${file.name}`;
    }

    // Vercel Blob에 업로드
    const blob = await put(fileName, file, { 
      access: 'public',
      addRandomSuffix: false // 파일명 중복 방지를 위해 false로 설정
    });

    return NextResponse.json({
      url: blob.url,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
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