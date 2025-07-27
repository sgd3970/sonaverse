import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * BrandStory Document (brand_stories 컬렉션)
 * - 브랜드 스토리 콘텐츠
 * - 다국어 지원, 요약, 본문(HTML, YouTube iframe 등 임베디드 미디어 포함), 썸네일, 작성자, 추천 스토리, 작성/수정일, 공개 여부
 */
export interface IBrandStoryImage {
  src: string;
  alt: string;
  alignment: 'left' | 'center' | 'right' | 'full';
  displaysize: number;
  originalWidth: number;
  originalHeight: number;
  uploadAt: Date;
}

export interface IBrandStoryContent {
  title: string;
  subtitle?: string;
  body: string; // HTML(iframe, img 등 임베디드 미디어 포함 가능)
  thumbnail_url?: string;
  images?: IBrandStoryImage[];
}

export interface IBrandStory extends Document {
  slug: string;
  author?: Types.ObjectId;
  youtube_url?: string;
  tags: string[];
  created_at: Date;
  last_updated: Date;
  updated_at: Date;
  updated_by: string;
  is_published: boolean;
  content: Record<string, IBrandStoryContent>;
}

const BrandStoryImageSchema = new Schema<IBrandStoryImage>({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  alignment: { type: String, enum: ['left', 'center', 'right', 'full'], default: 'center' },
  displaysize: { type: Number, default: 50 },
  originalWidth: { type: Number, required: true },
  originalHeight: { type: Number, required: true },
  uploadAt: { type: Date, default: Date.now }
}, { _id: false });

const BrandStoryContentSchema = new Schema<IBrandStoryContent>({
  title: { type: String, required: true },
  subtitle: { type: String },
  body: { type: String, required: true },
  thumbnail_url: { type: String },
  images: [BrandStoryImageSchema]
}, { _id: false });

const BrandStorySchema = new Schema<IBrandStory>({
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  author: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  youtube_url: { 
    type: String,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // 빈 값은 허용
        return /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+(\?.*)?$/.test(v);
      },
      message: 'Invalid YouTube embed URL format'
    }
  },
  tags: [{ type: String, trim: true }],
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  updated_by: { type: String, required: true },
  is_published: { type: Boolean, default: false },
  content: { type: Schema.Types.Mixed, required: true },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// 인덱스 설정
BrandStorySchema.index({ slug: 1 });
BrandStorySchema.index({ is_published: 1, created_at: -1 });
BrandStorySchema.index({ tags: 1 });

// 저장 전 middleware
BrandStorySchema.pre('save', function(this: IBrandStory, next) {
  this.updated_at = new Date();
  this.last_updated = new Date();
  next();
});

export default mongoose.models.BrandStory || mongoose.model<IBrandStory>('BrandStory', BrandStorySchema); 