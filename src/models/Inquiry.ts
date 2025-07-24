import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Inquiry Document (inquiries 컬렉션)
 * - 기업/대량 문의 폼 데이터
 * - 카테고리, 이름, 회사명, 연락처, 이메일, 메시지, 첨부파일, 상태, 관리자 메모, 답변 정보
 */
export interface IInquiry extends Document {
  inquiry_type: string;
  name: string;
  company_name: string;
  phone_number: string;
  email: string;
  message: string;
  attached_files: string[];
  submitted_at: Date;
  status: string;
  admin_notes?: string;
  responded_at?: Date;
  responded_by?: Types.ObjectId;
}

const InquirySchema = new Schema<IInquiry>({
  inquiry_type: { type: String, required: true },
  name: { type: String, required: true },
  company_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  attached_files: { type: [String], default: [] },
  submitted_at: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' },
  admin_notes: { type: String },
  responded_at: { type: Date },
  responded_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
});

export default mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema); 