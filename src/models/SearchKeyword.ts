import mongoose, { Schema, Document } from 'mongoose';

export interface ISearchKeyword extends Document {
  keyword: string;
  count: number;
  lastUsed: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SearchKeywordSchema: Schema = new Schema({
  keyword: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  count: {
    type: Number,
    required: true,
    default: 1
  },
  lastUsed: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// 복합 인덱스 생성
SearchKeywordSchema.index({ lastUsed: -1, count: -1 });

export default mongoose.models.SearchKeyword || mongoose.model<ISearchKeyword>('SearchKeyword', SearchKeywordSchema); 