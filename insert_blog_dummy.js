const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB 연결
const MONGODB_URI = 'mongodb+srv://admin:kACXwyLodJiLE3Ka@sonaverse.e0zqfop.mongodb.net/sonaverse?retryWrites=true&w=majority&appName=Sonaverse';

// AdminUser 스키마 (관리자 ID 참조용)
const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password_hash: { type: String, required: true },
  role: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  last_login_at: { type: Date }
});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

// BlogPost 스키마
const blogPostContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  body: { type: String, required: true },
  thumbnail_url: { type: String, required: true },
});

const blogPostSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  tags: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  is_published: { type: Boolean, default: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

async function insertBlogDummyData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB 연결 성공');

    // 관리자 사용자 찾기 (기존에 생성된 admin 사용자)
    const adminUser = await AdminUser.findOne({ email: 'admin@sonaverse.kr' });
    if (!adminUser) {
      console.error('관리자 사용자를 찾을 수 없습니다. 먼저 관리자 계정을 생성해주세요.');
      return;
    }

    // 기존 블로그 포스트 삭제 (선택사항)
    await BlogPost.deleteMany({});
    console.log('기존 블로그 포스트 삭제 완료');

    // 블로그 예시 데이터 7개
    const blogPosts = [
      {
        slug: 'manbo-walker-innovation-2025',
        author: adminUser._id,
        tags: ['보행기', '혁신', '시니어케어', '2025'],
        content: {
          ko: {
            title: '만보 보행기의 혁신적인 디자인, 2025년 새로운 도약',
            summary: '어르신들의 안전과 편안함을 위한 혁신적인 만보 보행기 디자인에 대해 알아보세요. 2025년 새로운 기술과 디자인이 적용된 만보 보행기의 특징을 소개합니다.',
            body: `
              <h2>만보 보행기의 혁신적인 디자인</h2>
              <p>2025년, 소나버스는 어르신들의 안전과 편안함을 위한 혁신적인 만보 보행기를 선보입니다. 기존의 보행기와는 차별화된 디자인과 기능으로 많은 분들의 관심을 받고 있습니다.</p>
              
              <h3>주요 특징</h3>
              <ul>
                <li><strong>안전성 강화:</strong> 4륜 안정 구조로 넘어짐 방지</li>
                <li><strong>편안한 사용:</strong> 인체공학적 핸들 디자인</li>
                <li><strong>휴대성:</strong> 접이식 구조로 보관과 이동이 편리</li>
                <li><strong>내구성:</strong> 고품질 알루미늄 프레임</li>
              </ul>
              
              <h3>디자인 철학</h3>
              <p>만보 보행기는 단순한 이동 도구가 아닌, 어르신들의 독립적인 생활을 지원하는 파트너입니다. 우리는 사용자의 관점에서 생각하고, 실제 사용 환경을 고려하여 디자인했습니다.</p>
              
              <h3>기술적 혁신</h3>
              <p>최신 기술을 적용하여 안전성과 사용성을 극대화했습니다. 특히 브레이크 시스템과 바퀴 구조에서 혁신적인 개선을 이루었습니다.</p>
            `,
            thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
          },
          en: {
            title: 'Innovative Design of Manbo Walker, New Leap in 2025',
            summary: 'Learn about the innovative design of Manbo Walker for the safety and comfort of seniors. Introducing the features of Manbo Walker with new technology and design applied in 2025.',
            body: `
              <h2>Innovative Design of Manbo Walker</h2>
              <p>In 2025, Sonaverse presents an innovative Manbo Walker for the safety and comfort of seniors. The differentiated design and functions from existing walkers are attracting much attention.</p>
              
              <h3>Key Features</h3>
              <ul>
                <li><strong>Enhanced Safety:</strong> 4-wheel stability structure to prevent falls</li>
                <li><strong>Comfortable Use:</strong> Ergonomic handle design</li>
                <li><strong>Portability:</strong> Foldable structure for easy storage and transport</li>
                <li><strong>Durability:</strong> High-quality aluminum frame</li>
              </ul>
              
              <h3>Design Philosophy</h3>
              <p>Manbo Walker is not just a mobility device, but a partner supporting seniors' independent living. We think from the user's perspective and design considering actual usage environments.</p>
              
              <h3>Technical Innovation</h3>
              <p>We applied the latest technology to maximize safety and usability. We achieved innovative improvements especially in the brake system and wheel structure.</p>
            `,
            thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
          }
        },
        is_published: true
      },
      {
        slug: 'bodeum-diaper-quality-management',
        author: adminUser._id,
        tags: ['기저귀', '품질관리', '프리미엄', '시니어케어'],
        content: {
          ko: {
            title: '보듬 기저귀의 철저한 품질 관리 시스템',
            summary: '최고 품질의 보듬 기저귀를 위한 철저한 품질 관리 과정을 소개합니다. 원료부터 완제품까지 모든 단계에서 이루어지는 품질 검사를 확인해보세요.',
            body: `
              <h2>보듬 기저귀 품질 관리 시스템</h2>
              <p>소나버스의 보듬 기저귀는 최고 품질을 보장하기 위해 철저한 품질 관리 시스템을 운영하고 있습니다. 원료 입고부터 완제품 출고까지 모든 단계에서 엄격한 검사를 실시합니다.</p>
              
              <h3>품질 관리 단계</h3>
              <ol>
                <li><strong>원료 검사:</strong> 모든 원료는 입고 시 품질 검사를 거칩니다</li>
                <li><strong>생산 과정 검사:</strong> 생산 라인에서 실시간 품질 모니터링</li>
                <li><strong>완제품 검사:</strong> 출고 전 최종 품질 검사</li>
                <li><strong>안정성 테스트:</strong> 장기 보관 안정성 검증</li>
              </ol>
              
              <h3>품질 기준</h3>
              <p>보듬 기저귀는 국제 품질 기준을 상회하는 엄격한 기준을 적용합니다. 흡수성, 투습성, 안전성 등 모든 측면에서 최고 수준을 유지합니다.</p>
              
              <h3>고객 만족도</h3>
              <p>철저한 품질 관리 덕분에 고객 만족도가 지속적으로 향상되고 있습니다. 실제 사용자들의 후기를 통해 품질의 우수성을 확인할 수 있습니다.</p>
            `,
            thumbnail_url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&h=600&fit=crop'
          },
          en: {
            title: 'Thorough Quality Management System for Bodeum Diaper',
            summary: 'Introducing the thorough quality management process for premium Bodeum diapers. Check out the quality inspections conducted at every stage from raw materials to finished products.',
            body: `
              <h2>Bodeum Diaper Quality Management System</h2>
              <p>Sonaverse's Bodeum diapers operate a thorough quality management system to ensure the highest quality. Strict inspections are conducted at every stage from raw material receipt to finished product shipment.</p>
              
              <h3>Quality Control Stages</h3>
              <ol>
                <li><strong>Raw Material Inspection:</strong> All raw materials undergo quality inspection upon receipt</li>
                <li><strong>Production Process Inspection:</strong> Real-time quality monitoring on production lines</li>
                <li><strong>Finished Product Inspection:</strong> Final quality inspection before shipment</li>
                <li><strong>Stability Testing:</strong> Long-term storage stability verification</li>
              </ol>
              
              <h3>Quality Standards</h3>
              <p>Bodeum diapers apply strict standards that exceed international quality standards. We maintain the highest level in all aspects including absorbency, breathability, and safety.</p>
              
              <h3>Customer Satisfaction</h3>
              <p>Thanks to thorough quality control, customer satisfaction is continuously improving. The excellence of quality can be confirmed through actual user reviews.</p>
            `,
            thumbnail_url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&h=600&fit=crop'
          }
        },
        is_published: true
      },
      {
        slug: 'customer-satisfaction-improvement-efforts',
        author: adminUser._id,
        tags: ['고객만족', '서비스', '품질', '소나버스'],
        content: {
          ko: {
            title: '고객 만족도 향상을 위한 소나버스의 지속적인 노력',
            summary: '고객의 만족을 위해 지속적으로 노력하는 소나버스의 이야기입니다. 고객 중심의 서비스와 제품 개발 과정을 소개합니다.',
            body: `
              <h2>고객 만족도 향상 노력</h2>
              <p>소나버스는 고객의 만족을 최우선 가치로 여기며, 지속적으로 서비스와 제품을 개선하고 있습니다. 고객의 목소리를 듣고 반영하는 것이 우리의 핵심 철학입니다.</p>
              
              <h3>고객 중심 접근법</h3>
              <ul>
                <li><strong>고객 피드백 수집:</strong> 정기적인 고객 만족도 조사</li>
                <li><strong>제품 개선:</strong> 고객 의견을 반영한 제품 개발</li>
                <li><strong>서비스 강화:</strong> 고객 지원 시스템 고도화</li>
                <li><strong>품질 관리:</strong> 지속적인 품질 향상</li>
              </ul>
              
              <h3>성과와 결과</h3>
              <p>고객 중심의 접근법을 통해 고객 만족도가 지속적으로 향상되고 있습니다. 특히 제품 품질과 고객 서비스 분야에서 높은 평가를 받고 있습니다.</p>
              
              <h3>미래 계획</h3>
              <p>앞으로도 고객의 니즈를 더욱 정확히 파악하고, 혁신적인 솔루션을 제공하여 고객 만족도를 한 단계 더 높여나갈 계획입니다.</p>
            `,
            thumbnail_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'
          },
          en: {
            title: 'Sonaverse\'s Continuous Efforts to Improve Customer Satisfaction',
            summary: 'The story of Sonaverse continuously striving for customer satisfaction. Introducing customer-centered service and product development processes.',
            body: `
              <h2>Customer Satisfaction Improvement Efforts</h2>
              <p>Sonaverse prioritizes customer satisfaction and continuously improves services and products. Listening to and reflecting customer voices is our core philosophy.</p>
              
              <h3>Customer-Centered Approach</h3>
              <ul>
                <li><strong>Customer Feedback Collection:</strong> Regular customer satisfaction surveys</li>
                <li><strong>Product Improvement:</strong> Product development reflecting customer opinions</li>
                <li><strong>Service Enhancement:</strong> Advanced customer support system</li>
                <li><strong>Quality Management:</strong> Continuous quality improvement</li>
              </ul>
              
              <h3>Performance and Results</h3>
              <p>Through customer-centered approach, customer satisfaction is continuously improving. We receive high evaluations especially in product quality and customer service areas.</p>
              
              <h3>Future Plans</h3>
              <p>We plan to more accurately understand customer needs and provide innovative solutions to further improve customer satisfaction.</p>
            `,
            thumbnail_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'
          }
        },
        is_published: true
      },
      {
        slug: 'senior-care-technology-trends-2025',
        author: adminUser._id,
        tags: ['시니어케어', '기술트렌드', '2025', '혁신'],
        content: {
          ko: {
            title: '2025년 시니어 케어 기술 트렌드와 소나버스의 대응',
            summary: '2025년 시니어 케어 분야의 주요 기술 트렌드를 분석하고, 소나버스가 어떻게 이러한 변화에 대응하고 있는지 알아보세요.',
            body: `
              <h2>2025년 시니어 케어 기술 트렌드</h2>
              <p>고령화 사회가 가속화되면서 시니어 케어 분야에서 혁신적인 기술들이 빠르게 발전하고 있습니다. 2025년 주요 트렌드를 분석해보겠습니다.</p>
              
              <h3>주요 기술 트렌드</h3>
              <ul>
                <li><strong>AI 기반 건강 모니터링:</strong> 실시간 건강 상태 추적</li>
                <li><strong>스마트 홈 케어:</strong> IoT 기반 자동화된 케어 시스템</li>
                <li><strong>웨어러블 디바이스:</strong> 건강 데이터 수집 및 분석</li>
                <li><strong>원격 의료 서비스:</strong> 비대면 건강 상담 및 진료</li>
              </ul>
              
              <h3>소나버스의 대응</h3>
              <p>소나버스는 이러한 기술 트렌드를 선도적으로 적용하여 시니어 친화적인 제품과 서비스를 개발하고 있습니다. 특히 AI와 IoT 기술을 활용한 혁신적인 솔루션을 제공합니다.</p>
              
              <h3>미래 전망</h3>
              <p>기술 발전과 함께 시니어 케어의 질이 크게 향상될 것으로 예상됩니다. 소나버스는 이러한 변화의 중심에 서서 혁신을 이끌어나갈 것입니다.</p>
            `,
            thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop'
          },
          en: {
            title: '2025 Senior Care Technology Trends and Sonaverse\'s Response',
            summary: 'Analyze the major technology trends in senior care for 2025 and learn how Sonaverse is responding to these changes.',
            body: `
              <h2>2025 Senior Care Technology Trends</h2>
              <p>As aging society accelerates, innovative technologies in senior care are rapidly developing. Let's analyze the major trends of 2025.</p>
              
              <h3>Major Technology Trends</h3>
              <ul>
                <li><strong>AI-based Health Monitoring:</strong> Real-time health status tracking</li>
                <li><strong>Smart Home Care:</strong> IoT-based automated care systems</li>
                <li><strong>Wearable Devices:</strong> Health data collection and analysis</li>
                <li><strong>Remote Medical Services:</strong> Non-face-to-face health consultation and treatment</li>
              </ul>
              
              <h3>Sonaverse's Response</h3>
              <p>Sonaverse is leading the application of these technology trends to develop senior-friendly products and services. We provide innovative solutions utilizing AI and IoT technologies.</p>
              
              <h3>Future Outlook</h3>
              <p>With technological advancement, the quality of senior care is expected to greatly improve. Sonaverse will lead innovation at the center of these changes.</p>
            `,
            thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop'
          }
        },
        is_published: true
      },
      {
        slug: 'sustainable-business-practices-sonaverse',
        author: adminUser._id,
        tags: ['지속가능경영', '환경보호', '사회책임', 'ESG'],
        content: {
          ko: {
            title: '소나버스의 지속가능 경영과 환경 보호 노력',
            summary: '소나버스가 추구하는 지속가능 경영과 환경 보호를 위한 다양한 노력을 소개합니다. ESG 경영을 통한 사회적 가치 창출에 대해 알아보세요.',
            body: `
              <h2>지속가능 경영의 중요성</h2>
              <p>소나버스는 단순한 이익 추구를 넘어서 사회적 가치를 창출하는 지속가능 경영을 추구합니다. 환경 보호와 사회적 책임을 경영의 핵심 가치로 삼고 있습니다.</p>
              
              <h3>환경 보호 노력</h3>
              <ul>
                <li><strong>친환경 제품 개발:</strong> 환경에 미치는 영향을 최소화하는 제품</li>
                <li><strong>에너지 효율성:</strong> 생산 과정에서의 에너지 절약</li>
                <li><strong>폐기물 감소:</strong> 재활용 가능한 포장재 사용</li>
                <li><strong>탄소 중립:</strong> 탄소 배출량 감소 노력</li>
              </ul>
              
              <h3>사회적 책임</h3>
              <p>지역 사회와 함께 성장하며, 다양한 사회 공헌 활동을 통해 사회적 가치를 창출하고 있습니다. 특히 시니어 케어 분야에서의 사회적 기여를 중시합니다.</p>
              
              <h3>미래 비전</h3>
              <p>앞으로도 지속가능한 미래를 위한 혁신적인 솔루션을 제공하며, 환경과 사회에 긍정적인 영향을 미치는 기업으로 성장할 것입니다.</p>
            `,
            thumbnail_url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop'
          },
          en: {
            title: 'Sonaverse\'s Sustainable Business Practices and Environmental Protection Efforts',
            summary: 'Introducing various efforts for sustainable business practices and environmental protection pursued by Sonaverse. Learn about creating social value through ESG management.',
            body: `
              <h2>Importance of Sustainable Business Practices</h2>
              <p>Sonaverse pursues sustainable business practices that create social value beyond simple profit pursuit. We consider environmental protection and social responsibility as core values of management.</p>
              
              <h3>Environmental Protection Efforts</h3>
              <ul>
                <li><strong>Eco-friendly Product Development:</strong> Products that minimize environmental impact</li>
                <li><strong>Energy Efficiency:</strong> Energy saving in production processes</li>
                <li><strong>Waste Reduction:</strong> Use of recyclable packaging materials</li>
                <li><strong>Carbon Neutrality:</strong> Efforts to reduce carbon emissions</li>
              </ul>
              
              <h3>Social Responsibility</h3>
              <p>We grow together with the local community and create social value through various social contribution activities. We particularly value social contribution in the senior care field.</p>
              
              <h3>Future Vision</h3>
              <p>We will continue to provide innovative solutions for a sustainable future and grow as a company that has a positive impact on the environment and society.</p>
            `,
            thumbnail_url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop'
          }
        },
        is_published: true
      },
      {
        slug: 'innovation-in-product-development',
        author: adminUser._id,
        tags: ['제품개발', '혁신', 'R&D', '기술'],
        content: {
          ko: {
            title: '소나버스의 제품 개발 혁신과 R&D 투자',
            summary: '소나버스가 추구하는 제품 개발 혁신과 지속적인 R&D 투자에 대해 알아보세요. 고객의 니즈를 반영한 혁신적인 제품 개발 과정을 소개합니다.',
            body: `
              <h2>제품 개발 혁신</h2>
              <p>소나버스는 고객의 니즈를 정확히 파악하고, 최신 기술을 적용하여 혁신적인 제품을 개발하고 있습니다. 지속적인 R&D 투자를 통해 시니어 케어 분야의 선도자로 자리매김하고 있습니다.</p>
              
              <h3>R&D 투자 현황</h3>
              <ul>
                <li><strong>매출 대비 R&D 투자:</strong> 매년 매출의 5% 이상을 R&D에 투자</li>
                <li><strong>연구 인력:</strong> 전문 연구원 30명 이상 확보</li>
                <li><strong>특허 출원:</strong> 연간 10건 이상의 특허 출원</li>
                <li><strong>대학 협력:</strong> 국내외 대학과의 연구 협력</li>
              </ul>
              
              <h3>혁신적 제품 개발 과정</h3>
              <p>고객의 목소리를 듣고, 시장 조사를 통해 니즈를 파악한 후, 최신 기술을 적용하여 제품을 개발합니다. 개발된 제품은 엄격한 품질 검사를 거쳐 시장에 출시됩니다.</p>
              
              <h3>미래 기술 개발</h3>
              <p>AI, IoT, 바이오 기술 등 최신 기술을 활용한 차세대 시니어 케어 제품을 개발하고 있습니다. 이를 통해 더욱 편리하고 안전한 제품을 제공할 계획입니다.</p>
            `,
            thumbnail_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop'
          },
          en: {
            title: 'Sonaverse\'s Product Development Innovation and R&D Investment',
            summary: 'Learn about product development innovation and continuous R&D investment pursued by Sonaverse. Introducing innovative product development processes reflecting customer needs.',
            body: `
              <h2>Product Development Innovation</h2>
              <p>Sonaverse accurately identifies customer needs and develops innovative products by applying the latest technology. We are establishing ourselves as a leader in senior care through continuous R&D investment.</p>
              
              <h3>R&D Investment Status</h3>
              <ul>
                <li><strong>R&D Investment vs Revenue:</strong> Invest more than 5% of revenue in R&D annually</li>
                <li><strong>Research Personnel:</strong> Secure more than 30 professional researchers</li>
                <li><strong>Patent Applications:</strong> Apply for more than 10 patents annually</li>
                <li><strong>University Cooperation:</strong> Research cooperation with domestic and foreign universities</li>
              </ul>
              
              <h3>Innovative Product Development Process</h3>
              <p>We listen to customer voices, identify needs through market research, and develop products by applying the latest technology. Developed products are released to the market after strict quality inspection.</p>
              
              <h3>Future Technology Development</h3>
              <p>We are developing next-generation senior care products utilizing the latest technologies such as AI, IoT, and bio-technology. We plan to provide more convenient and safer products through this.</p>
            `,
            thumbnail_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop'
          }
        },
        is_published: true
      },
      {
        slug: 'global-market-expansion-strategy',
        author: adminUser._id,
        tags: ['글로벌진출', '해외시장', '전략', '성장'],
        content: {
          ko: {
            title: '소나버스의 글로벌 시장 진출 전략과 성장 계획',
            summary: '소나버스가 추진하는 글로벌 시장 진출 전략과 해외 시장에서의 성장 계획에 대해 알아보세요. 세계 시장을 향한 소나버스의 도전을 소개합니다.',
            body: `
              <h2>글로벌 시장 진출 전략</h2>
              <p>소나버스는 국내 시장에서의 성공을 바탕으로 글로벌 시장 진출을 추진하고 있습니다. 세계 각국의 시니어 케어 시장에서 우리의 혁신적인 제품과 서비스를 제공할 계획입니다.</p>
              
              <h3>진출 전략</h3>
              <ul>
                <li><strong>단계적 진출:</strong> 아시아 태평양 지역부터 시작하여 점진적 확장</li>
                <li><strong>현지화 전략:</strong> 각 지역의 문화와 니즈에 맞는 제품 개발</li>
                <li><strong>파트너십:</strong> 현지 파트너와의 전략적 협력</li>
                <li><strong>브랜드 인지도:</strong> 글로벌 브랜드 인지도 향상</li>
              </ul>
              
              <h3>목표 시장</h3>
              <p>일본, 중국, 동남아시아를 우선 진출 시장으로 선정하고, 이후 유럽과 북미 시장으로 확장할 계획입니다. 각 시장의 특성을 고려한 맞춤형 전략을 수립하고 있습니다.</p>
              
              <h3>성장 전망</h3>
              <p>글로벌 시장 진출을 통해 매출 성장과 브랜드 가치 향상을 기대하고 있습니다. 세계 시니어 케어 시장의 선도자로 성장하는 것이 우리의 목표입니다.</p>
            `,
            thumbnail_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop'
          },
          en: {
            title: 'Sonaverse\'s Global Market Expansion Strategy and Growth Plan',
            summary: 'Learn about Sonaverse\'s global market expansion strategy and growth plan in overseas markets. Introducing Sonaverse\'s challenge toward the global market.',
            body: `
              <h2>Global Market Expansion Strategy</h2>
              <p>Sonaverse is pursuing global market expansion based on success in the domestic market. We plan to provide our innovative products and services in senior care markets around the world.</p>
              
              <h3>Expansion Strategy</h3>
              <ul>
                <li><strong>Phased Entry:</strong> Start from Asia-Pacific region and expand gradually</li>
                <li><strong>Localization Strategy:</strong> Develop products suitable for each region's culture and needs</li>
                <li><strong>Partnership:</strong> Strategic cooperation with local partners</li>
                <li><strong>Brand Recognition:</strong> Improve global brand recognition</li>
              </ul>
              
              <h3>Target Markets</h3>
              <p>We have selected Japan, China, and Southeast Asia as priority entry markets, and plan to expand to European and North American markets later. We are establishing customized strategies considering the characteristics of each market.</p>
              
              <h3>Growth Outlook</h3>
              <p>We expect revenue growth and brand value improvement through global market expansion. Our goal is to grow as a leader in the global senior care market.</p>
            `,
            thumbnail_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop'
          }
        },
        is_published: true
      }
    ];

    // 블로그 포스트 삽입
    for (const postData of blogPosts) {
      const blogPost = new BlogPost(postData);
      await blogPost.save();
      console.log(`블로그 포스트 생성 완료: ${postData.slug}`);
    }

    console.log('모든 블로그 포스트 삽입 완료!');
    console.log(`총 ${blogPosts.length}개의 블로그 포스트가 생성되었습니다.`);

  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB 연결 종료');
  }
}

// 스크립트 실행
insertBlogDummyData(); 