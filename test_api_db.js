const mongoose = require('mongoose');

// API 라우트와 동일한 환경변수 사용
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:kACXwyLodJiLE3Ka@sonaverse.e0zqfop.mongodb.net/sonaverse?retryWrites=true&w=majority&appName=Sonaverse';

console.log('=== API DB Test ===');
console.log('MONGODB_URI:', MONGODB_URI ? '설정됨' : '설정되지 않음');

async function testApiDB() {
  try {
    // API 라우트와 동일한 연결 방식
    await mongoose.connect(MONGODB_URI);
    console.log('DB 연결 완료');
    
    // API 라우트와 동일한 스키마 정의
    const PressReleaseSchema = new mongoose.Schema({
      slug: { type: String, required: true, unique: true },
      published_date: { type: Date, required: true },
      press_name: { type: mongoose.Schema.Types.Mixed, required: true },
      content: { type: mongoose.Schema.Types.Mixed, required: true },
      created_at: { type: Date, default: Date.now },
      last_updated: { type: Date, default: Date.now },
      updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: true },
      is_active: { type: Boolean, default: true },
    }, { collection: 'press' });

    const PressRelease = mongoose.model('PressRelease', PressReleaseSchema, 'press');
    
    // API 라우트와 동일한 쿼리
    const query = { is_active: true };
    console.log('쿼리 조건:', JSON.stringify(query));
    
    const total = await PressRelease.countDocuments(query);
    console.log('총 문서 수:', total);
    
    const pressReleases = await PressRelease.find(query)
      .sort({ published_date: -1 })
      .skip(0)
      .limit(10);
    
    console.log('조회된 문서 수:', pressReleases.length);
    if (pressReleases.length > 0) {
      console.log('첫 번째 문서:', {
        slug: pressReleases[0].slug,
        title: pressReleases[0].content?.ko?.title || pressReleases[0].content?.en?.title
      });
    }
    
    await mongoose.disconnect();
    console.log('DB 연결 종료');
    
  } catch (error) {
    console.error('오류:', error);
    process.exit(1);
  }
}

testApiDB(); 