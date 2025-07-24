import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * BrandStory Document (brand_stories 컬렉션)
 * - 브랜드 스토리 콘텐츠
 * - 다국어 지원, 요약, 본문(HTML), 썸네일, 작성자, 추천 스토리, 작성/수정일, 공개 여부
 */
export interface IBrandStoryContent {
  title: string;
  subtitle: string;
  body: string;
  thumbnail_url: string;
}

export interface IBrandStory extends Document {
  slug: string;
  author: Types.ObjectId;
  created_at: Date;
  last_updated: Date;
  is_published: boolean;
  content: Record<string, IBrandStoryContent>;
}

const BrandStoryContentSchema = new Schema<IBrandStoryContent>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  body: { type: String, required: true },
  thumbnail_url: { type: String, required: true },
});

const BrandStorySchema = new Schema<IBrandStory>({
  slug: { type: String, required: true, unique: true },
  author: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  is_published: { type: Boolean, default: true },
  content: { type: Schema.Types.Mixed, required: true },
});

export default mongoose.models.BrandStory || mongoose.model<IBrandStory>('BrandStory', BrandStorySchema); 