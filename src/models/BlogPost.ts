import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * BlogPost Document (blog_posts 컬렉션)
 * - 회사 블로그 게시물
 * - 다국어 지원, 태그, 썸네일, 본문(HTML), 작성/수정일, 공개 여부
 */
export interface IBlogPostContent {
  title: string;
  summary: string;
  body: string;
  thumbnail_url: string;
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

const BlogPostContentSchema = new Schema<IBlogPostContent>({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  body: { type: String, required: true },
  thumbnail_url: { type: String, required: true },
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