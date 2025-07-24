/**
 * 이메일 알림 유틸리티
 * 실제 구현 시에는 Nodemailer, SendGrid, Resend 등의 서비스 사용
 */

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * 이메일 전송 함수 (모킹)
 */
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // 실제 구현 시에는 여기에 이메일 서비스 연동
    console.log('📧 이메일 전송:', {
      to: emailData.to,
      subject: emailData.subject,
      timestamp: new Date().toISOString()
    });
    
    // 개발 환경에서는 실제 전송하지 않고 로그만 출력
    if (process.env.NODE_ENV === 'development') {
      console.log('개발 환경 - 이메일 내용:', emailData.html);
      return true;
    }
    
    // 프로덕션 환경에서는 실제 이메일 서비스 호출
    // await emailService.send(emailData);
    
    return true;
  } catch (error) {
    console.error('이메일 전송 실패:', error);
    return false;
  }
}

/**
 * 문의 접수 알림 이메일
 */
export async function sendInquiryNotification(inquiryData: any): Promise<boolean> {
  const subject = '새로운 문의가 접수되었습니다';
  const html = `
    <h2>새로운 문의 접수</h2>
    <p><strong>문의 유형:</strong> ${inquiryData.inquiry_type}</p>
    <p><strong>이름:</strong> ${inquiryData.name}</p>
    <p><strong>회사명:</strong> ${inquiryData.company_name}</p>
    <p><strong>이메일:</strong> ${inquiryData.email}</p>
    <p><strong>전화번호:</strong> ${inquiryData.phone_number}</p>
    <p><strong>메시지:</strong></p>
    <p>${inquiryData.message}</p>
    <p><strong>접수 시간:</strong> ${new Date(inquiryData.submitted_at).toLocaleString('ko-KR')}</p>
  `;

  return sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@sonaverse.com',
    subject,
    html
  });
}

/**
 * 문의 상태 변경 알림 이메일
 */
export async function sendInquiryStatusUpdate(inquiryData: any, newStatus: string): Promise<boolean> {
  const statusText = {
    'pending': '접수됨',
    'in_progress': '처리중',
    'completed': '완료',
    'closed': '종료'
  };

  const subject = `문의 상태가 변경되었습니다: ${statusText[newStatus as keyof typeof statusText]}`;
  const html = `
    <h2>문의 상태 변경</h2>
    <p><strong>문의 유형:</strong> ${inquiryData.inquiry_type}</p>
    <p><strong>이름:</strong> ${inquiryData.name}</p>
    <p><strong>회사명:</strong> ${inquiryData.company_name}</p>
    <p><strong>새로운 상태:</strong> ${statusText[newStatus as keyof typeof statusText]}</p>
    <p><strong>변경 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
  `;

  return sendEmail({
    to: inquiryData.email,
    subject,
    html
  });
}

/**
 * 관리자 계정 생성 알림 이메일
 */
export async function sendAdminAccountCreated(userData: any, tempPassword: string): Promise<boolean> {
  const subject = '관리자 계정이 생성되었습니다';
  const html = `
    <h2>관리자 계정 생성</h2>
    <p><strong>사용자명:</strong> ${userData.username}</p>
    <p><strong>이름:</strong> ${userData.name}</p>
    <p><strong>임시 비밀번호:</strong> ${tempPassword}</p>
    <p>보안을 위해 로그인 후 비밀번호를 변경해주세요.</p>
  `;

  return sendEmail({
    to: userData.email,
    subject,
    html
  });
} 