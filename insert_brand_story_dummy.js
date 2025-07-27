const mongoose = require('mongoose');
require('dotenv').config();

// BrandStory 스키마 정의
const BrandStorySchema = new mongoose.Schema({
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  youtube_url: { 
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
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
  content: { type: mongoose.Schema.Types.Mixed, required: true },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const BrandStory = mongoose.model('BrandStory', BrandStorySchema);

const dummyBrandStories = [
  {
    slug: 'sonaverse-story-1',
    content: {
      ko: {
        title: '소나버스의 시작',
        subtitle: '혁신적인 육아 제품으로 시작된 여정',
        body: '소나버스는 2020년에 설립되어 혁신적인 육아 제품을 개발하기 시작했습니다. 우리의 첫 번째 제품인 만보 보행기는 아이들의 안전과 발달을 고려하여 설계되었습니다.'
      },
      en: {
        title: 'The Beginning of Sonaverse',
        subtitle: 'A journey started with innovative parenting products',
        body: 'Sonaverse was established in 2020 and began developing innovative parenting products. Our first product, the Manbo Walker, was designed with children\'s safety and development in mind.'
      }
    },
    is_published: true,
    updated_by: 'admin',
    tags: ['브랜드', '시작', '혁신']
  },
  {
    slug: 'sonaverse-story-2',
    content: {
      ko: {
        title: '보듬 기저귀의 탄생',
        subtitle: '아이의 피부를 생각한 친환경 기저귀',
        body: '보듬 기저귀는 아이들의 민감한 피부를 위해 특별히 개발되었습니다. 천연 소재를 사용하여 피부 자극을 최소화하고, 친환경적인 제품으로 환경도 함께 생각합니다.'
      },
      en: {
        title: 'The Birth of Bodeum Diaper',
        subtitle: 'Eco-friendly diaper that cares for baby\'s skin',
        body: 'Bodeum Diaper was specially developed for children\'s sensitive skin. Using natural materials to minimize skin irritation, it\'s an eco-friendly product that also considers the environment.'
      }
    },
    is_published: false,
    updated_by: 'admin',
    tags: ['기저귀', '친환경', '피부']
  },
  {
    slug: 'sonaverse-story-3',
    content: {
      ko: {
        title: '미래를 향한 도약',
        subtitle: '지속 가능한 육아 제품의 미래',
        body: '소나버스는 지속 가능한 육아 제품의 미래를 만들어가고 있습니다. 우리는 아이들의 건강과 환경 보호를 동시에 고려한 제품을 개발하여 더 나은 미래를 만들어가고 있습니다.'
      },
      en: {
        title: 'Leap Toward the Future',
        subtitle: 'The future of sustainable parenting products',
        body: 'Sonaverse is creating the future of sustainable parenting products. We develop products that consider both children\'s health and environmental protection to create a better future.'
      }
    },
    is_published: true,
    updated_by: 'admin',
    tags: ['미래', '지속가능', '건강']
  }
];

async function insertDummyData() {
  try {
    // MongoDB 연결 (환경 변수에서 URI 가져오기)
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://sonaverse:sonaverse123@cluster0.mongodb.net/sonaverse?retryWrites=true&w=majority';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // 기존 더미 데이터 삭제
    for (const story of dummyBrandStories) {
      await BrandStory.deleteOne({ slug: story.slug });
    }
    console.log('Cleaned up existing dummy data');

    // 새 더미 데이터 삽입
    for (const storyData of dummyBrandStories) {
      const story = new BrandStory(storyData);
      await story.save();
      console.log(`Created brand story: ${storyData.slug}`);
    }

    console.log('All dummy brand stories created successfully');

    // 생성된 데이터 확인
    const totalStories = await BrandStory.countDocuments({});
    console.log(`Total brand stories in database: ${totalStories}`);

  } catch (error) {
    console.error('Error inserting dummy data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

insertDummyData(); 