import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../../app/i18n';

const AdminLoginPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 인증 로직은 추후 구현
  };

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 bg-white">
      <div className="max-w-sm w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">{t('admin_login', '관리자 로그인')}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            {t('username', '아이디')}
            <input name="username" value={form.username} onChange={handleChange} className="border rounded px-3 py-2" autoComplete="username" />
          </label>
          <label className="flex flex-col gap-1">
            {t('password', '비밀번호')}
            <input name="password" type="password" value={form.password} onChange={handleChange} className="border rounded px-3 py-2" autoComplete="current-password" />
          </label>
          <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition">
            {t('login', '로그인')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage; 