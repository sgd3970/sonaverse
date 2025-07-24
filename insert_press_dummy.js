const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://admin:kACXwyLodJiLE3Ka@sonaverse.e0zqfop.mongodb.net/sonaverse?retryWrites=true&w=majority&appName=Sonaverse';

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

async function main() {
  await mongoose.connect(MONGODB_URI);
  await Press.deleteMany({});
  await Press.insertMany([
    { slug: 'award-2025', published_date: new Date('2025-07-20'), press_name: { ko: '전자신문', en: 'ET News' }, content: { ko: { title: '당사, 2025 혁신 기술상 수상', body: '저희 회사가 2025 혁신 기술상을 수상했습니다.', external_link: 'https://www.etnews.com/20250720000001' }, en: { title: 'Our Company Wins 2025 Innovation Technology Award', body: 'Our company has won the 2025 Innovation Technology Award.', external_link: 'https://www.etnews.com/20250720000001' } }, updated_by: null, is_active: true },
    { slug: 'media-feature', published_date: new Date('2025-06-15'), press_name: { ko: '매일경제', en: 'Maeil Business' }, content: { ko: { title: '당사, 주요 언론에 소개', body: '당사가 주요 언론에 소개되었습니다.', external_link: 'https://www.mk.co.kr/news/business/2025/06/15/123456' }, en: { title: 'Our Company Featured in Major Media', body: 'Our company was featured in major media.', external_link: 'https://www.mk.co.kr/news/business/2025/06/15/123456' } }, updated_by: null, is_active: true },
    { slug: 'eco-award', published_date: new Date('2025-05-10'), press_name: { ko: '환경일보', en: 'Eco News' }, content: { ko: { title: '친환경 경영대상 수상', body: '친환경 경영으로 대상을 수상했습니다.', external_link: 'https://eco.com/20250510' }, en: { title: 'Eco Management Grand Prize', body: 'Awarded for eco-friendly management.', external_link: 'https://eco.com/20250510' } }, updated_by: null, is_active: true },
    { slug: 'startup-100', published_date: new Date('2025-04-01'), press_name: { ko: '스타트업뉴스', en: 'Startup News' }, content: { ko: { title: '2025 유망 스타트업 100 선정', body: '2025년 유망 스타트업 100에 선정되었습니다.', external_link: 'https://startupnews.com/20250401' }, en: { title: 'Selected as Top 100 Startups 2025', body: 'Selected as one of the top 100 startups in 2025.', external_link: 'https://startupnews.com/20250401' } }, updated_by: null, is_active: true },
    { slug: 'global-expansion', published_date: new Date('2025-03-20'), press_name: { ko: '글로벌경제', en: 'Global Economy' }, content: { ko: { title: '글로벌 시장 진출', body: '글로벌 시장에 본격 진출했습니다.', external_link: 'https://globaleconomy.com/20250320' }, en: { title: 'Entering the Global Market', body: 'We have entered the global market.', external_link: 'https://globaleconomy.com/20250320' } }, updated_by: null, is_active: true },
    { slug: 'csr-award', published_date: new Date('2025-02-15'), press_name: { ko: '사회공헌신문', en: 'CSR News' }, content: { ko: { title: '사회공헌상 수상', body: '사회공헌 활동으로 상을 받았습니다.', external_link: 'https://csrnews.com/20250215' }, en: { title: 'CSR Award Winner', body: 'Received an award for CSR activities.', external_link: 'https://csrnews.com/20250215' } }, updated_by: null, is_active: true },
    { slug: 'tech-partnership', published_date: new Date('2025-01-30'), press_name: { ko: '테크타임즈', en: 'Tech Times' }, content: { ko: { title: '기술 제휴 체결', body: '국내외 기업과 기술 제휴를 체결했습니다.', external_link: 'https://techtimes.com/20250130' }, en: { title: 'Technology Partnership Signed', body: 'Signed a technology partnership with domestic and foreign companies.', external_link: 'https://techtimes.com/20250130' } }, updated_by: null, is_active: true },
    { slug: 'patent-news', published_date: new Date('2024-12-10'), press_name: { ko: '특허저널', en: 'Patent Journal' }, content: { ko: { title: '신기술 특허 등록', body: '신기술 특허를 등록했습니다.', external_link: 'https://patentjournal.com/20241210' }, en: { title: 'New Technology Patent Registered', body: 'Registered a new technology patent.', external_link: 'https://patentjournal.com/20241210' } }, updated_by: null, is_active: true },
    { slug: 'award-2024', published_date: new Date('2024-11-05'), press_name: { ko: '산업일보', en: 'Industry Daily' }, content: { ko: { title: '2024 산업대상 수상', body: '2024년 산업대상을 수상했습니다.', external_link: 'https://industrydaily.com/20241105' }, en: { title: '2024 Industry Grand Prize', body: 'Won the 2024 Industry Grand Prize.', external_link: 'https://industrydaily.com/20241105' } }, updated_by: null, is_active: true },
    { slug: 'ai-feature', published_date: new Date('2024-10-01'), press_name: { ko: 'AI뉴스', en: 'AI News' }, content: { ko: { title: 'AI 기술력 집중 조명', body: 'AI 기술력이 언론에 집중 조명되었습니다.', external_link: 'https://ainews.com/20241001' }, en: { title: 'AI Technology in the Spotlight', body: 'Our AI technology was featured in the media.', external_link: 'https://ainews.com/20241001' } }, updated_by: null, is_active: true },
    { slug: 'export-success', published_date: new Date('2024-09-15'), press_name: { ko: '무역일보', en: 'Trade Daily' }, content: { ko: { title: '수출 성공 사례', body: '수출 성공 사례가 보도되었습니다.', external_link: 'https://tradedaily.com/20240915' }, en: { title: 'Export Success Story', body: 'Our export success story was reported.', external_link: 'https://tradedaily.com/20240915' } }, updated_by: null, is_active: true },
  ]);
  console.log('더미 데이터 삽입 완료!');
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); }); 