import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import Inquiry from '../../../../models/Inquiry';

/**
 * 개별 문의 조회, 수정, 삭제 API
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const inquiry = await Inquiry.findById(resolvedParams.id);
    
    if (!inquiry) {
      return NextResponse.json(
        { error: '문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    return NextResponse.json(
      { error: '문의를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const body = await request.json();
    
    const inquiry = await Inquiry.findByIdAndUpdate(
      resolvedParams.id,
      { ...body, responded_at: body.status === 'completed' ? new Date() : undefined },
      { new: true, runValidators: true }
    );
    
    if (!inquiry) {
      return NextResponse.json(
        { error: '문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { error: '문의 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const inquiry = await Inquiry.findByIdAndDelete(resolvedParams.id);
    
    if (!inquiry) {
      return NextResponse.json(
        { error: '문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: '문의가 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { error: '문의 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 