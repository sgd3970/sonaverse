const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://admin:kACXwyLodJiLE3Ka@sonaverse.e0zqfop.mongodb.net/sonaverse?retryWrites=true&w=majority&appName=Sonaverse';

async function testConnection() {
  try {
    console.log('DB 연결 시도...');
    await mongoose.connect(MONGODB_URI);
    console.log('DB 연결 성공!');
    
    // press 컬렉션 직접 확인
    const db = mongoose.connection.db;
    const pressCollection = db.collection('press');
    
    const count = await pressCollection.countDocuments();
    console.log(`press 컬렉션 문서 수: ${count}`);
    
    if (count > 0) {
      const docs = await pressCollection.find({}).limit(3).toArray();
      console.log('첫 3개 문서:');
      docs.forEach((doc, i) => {
        console.log(`${i + 1}. slug: ${doc.slug}, title: ${doc.content?.ko?.title || doc.content?.en?.title}`);
      });
    }
    
    // PressRelease 모델로도 확인
    const PressSchema = new mongoose.Schema({
      slug: String,
      published_date: Date,
      press_name: {
        ko: String,
        en: String,
      },
      content: {
        ko: {
          title: String,
          body: String,
          external_link: String,
        },
        en: {
          title: String,
          body: String,
          external_link: String,
        },
      },
      updated_by: mongoose.Schema.Types.ObjectId,
      is_active: Boolean,
    }, { collection: 'press' });

    const Press = mongoose.model('Press', PressSchema, 'press');
    
    const modelCount = await Press.countDocuments();
    console.log(`Press 모델로 조회한 문서 수: ${modelCount}`);
    
    if (modelCount > 0) {
      const modelDocs = await Press.find({}).limit(3);
      console.log('Press 모델로 조회한 첫 3개 문서:');
      modelDocs.forEach((doc, i) => {
        console.log(`${i + 1}. slug: ${doc.slug}, title: ${doc.content?.ko?.title || doc.content?.en?.title}`);
      });
    }
    
    await mongoose.disconnect();
    console.log('DB 연결 종료');
    
  } catch (error) {
    console.error('오류:', error);
    process.exit(1);
  }
}

testConnection(); 