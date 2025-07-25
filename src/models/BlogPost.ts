import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * BlogPost Document (blog_posts 컬렉션)
 * - 회사 블로그 게시물
 * - 다국어 지원, 태그, 썸네일, 본문(HTML), 작성/수정일, 공개 여부
 */
export interface IBlogPostImage {
  src: string;
  alt: string;
  alignment: 'left' | 'center' | 'right' | 'full';
  displaysize: number;
  originalWidth: number;
  originalHeight: number;
  uploadAt: Date;
}

export interface IBlogPostContent {
  title: string;
  subtitle: string;
  body: string;
  thumbnail_url: string;
  images: IBlogPostImage[];
}

export interface IBlogPost extends Document {
  slug: string;
  author: Types.ObjectId;
  tags: string[];
  created_at: Date;
  last_updated: Date;
  is_published: boolean;
  content: Record<string, IBlogPostContent>;
}

const BlogPostImageSchema = new Schema<IBlogPostImage>({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  alignment: { type: String, enum: ['left', 'center', 'right', 'full'], default: 'center' },
  displaysize: { type: Number, required: true, min: 10, max: 100 },
  originalWidth: { type: Number, required: true },
  originalHeight: { type: Number, required: true },
  uploadAt: { type: Date, default: Date.now }
});

const BlogPostContentSchema = new Schema<IBlogPostContent>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  body: { type: String, required: true },
  thumbnail_url: { type: String, required: true },
  images: { type: [BlogPostImageSchema], default: [] }
});

const BlogPostSchema = new Schema<IBlogPost>({
  slug: { type: String, required: true, unique: true },
  author: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  tags: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  is_published: { type: Boolean, default: true },
  content: { type: Schema.Types.Mixed, required: true },
});

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema); 