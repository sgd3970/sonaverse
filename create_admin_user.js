const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://admin:kACXwyLodJiLE3Ka@sonaverse.e0zqfop.mongodb.net/sonaverse?retryWrites=true&w=majority&appName=Sonaverse';

const AdminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  last_login_at: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true },
});

const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

async function createAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB 연결 성공');

    // 기존 admin 계정이 있는지 확인
    const existingAdmin = await AdminUser.findOne({ email: 'admin@sonaverse.kr' });
    if (existingAdmin) {
      console.log('이미 admin 계정이 존재합니다.');
      await mongoose.disconnect();
      return;
    }

    // 비밀번호 해시화
    const password = 'sona221129!';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // admin 계정 생성
    const adminUser = new AdminUser({
      username: '(주)소나버스',
      password_hash: passwordHash,
      email: 'admin@sonaverse.kr',
      role: '관리자',
      is_active: true
    });

    await adminUser.save();
    console.log('Admin 계정이 성공적으로 생성되었습니다!');
    console.log('이메일:', adminUser.email);
    console.log('사용자명:', adminUser.username);
    console.log('역할:', adminUser.role);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Admin 계정 생성 중 오류 발생:', error);
    await mongoose.disconnect();
  }
}

createAdminUser(); 