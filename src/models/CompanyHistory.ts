import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * CompanyHistory Document (company_history 컬렉션)
 * - 회사 연혁 데이터
 * - 연도, 다국어 이벤트, 이미지, 정렬 순서, 업데이트 정보, 활성화 여부
 */
export interface ICompanyHistory extends Document {
  year: number;
  events: Record<string, string>;
  image_url?: string;
  order: number;
  created_at: Date;
  last_updated: Date;
  updated_by: Types.ObjectId;
  is_active: boolean;
}

const CompanyHistorySchema = new Schema<ICompanyHistory>({
  year: { type: Number, required: true },
  events: { type: Schema.Types.Mixed, required: true },
  image_url: { type: String },
  order: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  updated_by: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  is_active: { type: Boolean, default: true },
});

export default mongoose.models.CompanyHistory || mongoose.model<ICompanyHistory>('CompanyHistory', CompanyHistorySchema); 