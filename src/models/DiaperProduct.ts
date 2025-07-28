import mongoose, { Schema, Document } from 'mongoose';

export interface IDiaperProduct extends Document {
  slug: string;
  name: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  thumbnail_image: string;
  product_images: string[];
  detail_images: string[];
  category: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const DiaperProductSchema = new Schema<IDiaperProduct>({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    ko: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
  },
  description: {
    ko: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
  },
  thumbnail_image: {
    type: String,
    required: true
  },
  product_images: [{
    type: String,
    required: true
  }],
  detail_images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['팬티형', '밴드형', '물티슈', '기타']
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// slug 인덱스 추가
DiaperProductSchema.index({ slug: 1 });

export default mongoose.models.DiaperProduct || mongoose.model<IDiaperProduct>('DiaperProduct', DiaperProductSchema); 