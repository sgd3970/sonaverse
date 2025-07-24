'use client';

import React, { useState } from 'react';

const AdminSettings: React.FC = () => {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [activeTab, setActiveTab] = useState('site');

  const settingsData = {
    ko: {
      title: '관리자 설정',
      tabs: {
        site: '사이트 설정',
        admin: '관리자 계정',
        system: '시스템 설정'
      },
      siteSettings: {
        title: '사이트 기본 설정',
        siteName: '사이트명',
        siteDescription: '사이트 설명',
        contactEmail: '연락처 이메일',
        contactPhone: '연락처 전화번호',
        address: '주소',
        save: '저장'
      },
      adminSettings: {
        title: '관리자 계정 관리',
        currentPassword: '현재 비밀번호',
        newPassword: '새 비밀번호',
        confirmPassword: '새 비밀번호 확인',
        changePassword: '비밀번호 변경',
        profile: {
          title: '프로필 정보',
          name: '이름',
          email: '이메일',
          role: '권한',
          lastLogin: '마지막 로그인'
        }
      },
      systemSettings: {
        title: '시스템 설정',
        maintenance: '유지보수 모드',
        maintenanceMessage: '유지보수 메시지',
        enableComments: '댓글 기능 활성화',
        enableRegistration: '회원가입 활성화',
        save: '저장'
      }
    },
    en: {
      title: 'Admin Settings',
      tabs: {
        site: 'Site Settings',
        admin: 'Admin Account',
        system: 'System Settings'
      },
      siteSettings: {
        title: 'Site Basic Settings',
        siteName: 'Site Name',
        siteDescription: 'Site Description',
        contactEmail: 'Contact Email',
        contactPhone: 'Contact Phone',
        address: 'Address',
        save: 'Save'
      },
      adminSettings: {
        title: 'Admin Account Management',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        changePassword: 'Change Password',
        profile: {
          title: 'Profile Information',
          name: 'Name',
          email: 'Email',
          role: 'Role',
          lastLogin: 'Last Login'
        }
      },
      systemSettings: {
        title: 'System Settings',
        maintenance: 'Maintenance Mode',
        maintenanceMessage: 'Maintenance Message',
        enableComments: 'Enable Comments',
        enableRegistration: 'Enable Registration',
        save: 'Save'
      }
    }
  };

  const t = settingsData[lang];

  // Mock data
  const [siteSettings, setSiteSettings] = useState({
    siteName: { ko: 'SONAVERSE', en: 'SONAVERSE' },
    siteDescription: { ko: '최고의 제품과 서비스로 고객 만족을 추구합니다.', en: 'Pursuing customer satisfaction with the best products and services.' },
    contactEmail: 'cs@sonaverse.com',
    contactPhone: '033-123-4567',
    address: { ko: '강원도 춘천시 어쩌고 빌딩', en: 'Some Building, Chuncheon, Gangwon-do' }
  });

  const [adminProfile] = useState({
    name: '관리자',
    email: 'admin@sonaverse.com',
    role: 'Super Admin',
    lastLogin: '2024-01-15 14:30:00'
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenance: false,
    maintenanceMessage: { ko: '현재 시스템 점검 중입니다. 잠시만 기다려주세요.', en: 'System maintenance in progress. Please wait a moment.' },
    enableComments: true,
    enableRegistration: false
  });

  const handleSiteSettingsSave = () => {
    // Save site settings logic
    console.log('Saving site settings:', siteSettings);
  };

  const handleSystemSettingsSave = () => {
    // Save system settings logic
    console.log('Saving system settings:', systemSettings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600 mt-1">
            {lang === 'ko' ? '관리자 설정을 관리합니다.' : 'Manage admin settings.'}
          </p>
        </div>
        <select
          className="border rounded-lg px-3 py-2"
          value={lang}
          onChange={(e) => setLang(e.target.value as 'ko' | 'en')}
        >
          <option value="ko">한국어</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {Object.entries(t.tabs).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {value}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'site' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t.siteSettings.title}</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.siteSettings.siteName} (한국어)
                  </label>
                  <input
                    type="text"
                    value={siteSettings.siteName.ko}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      siteName: { ...siteSettings.siteName, ko: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.siteSettings.siteName} (English)
                  </label>
                  <input
                    type="text"
                    value={siteSettings.siteName.en}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      siteName: { ...siteSettings.siteName, en: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.siteSettings.siteDescription} (한국어)
                  </label>
                  <textarea
                    value={siteSettings.siteDescription.ko}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      siteDescription: { ...siteSettings.siteDescription, ko: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.siteSettings.siteDescription} (English)
                  </label>
                  <textarea
                    value={siteSettings.siteDescription.en}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      siteDescription: { ...siteSettings.siteDescription, en: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.siteSettings.contactEmail}
                  </label>
                  <input
                    type="email"
                    value={siteSettings.contactEmail}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      contactEmail: e.target.value
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.siteSettings.contactPhone}
                  </label>
                  <input
                    type="text"
                    value={siteSettings.contactPhone}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      contactPhone: e.target.value
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSiteSettingsSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t.siteSettings.save}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t.adminSettings.title}</h2>
            <div className="space-y-6">
              {/* Profile Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t.adminSettings.profile.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.adminSettings.profile.name}
                    </label>
                    <p className="text-sm text-gray-900">{adminProfile.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.adminSettings.profile.email}
                    </label>
                    <p className="text-sm text-gray-900">{adminProfile.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.adminSettings.profile.role}
                    </label>
                    <p className="text-sm text-gray-900">{adminProfile.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.adminSettings.profile.lastLogin}
                    </label>
                    <p className="text-sm text-gray-900">{adminProfile.lastLogin}</p>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t.adminSettings.changePassword}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.adminSettings.currentPassword}
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.adminSettings.newPassword}
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.adminSettings.confirmPassword}
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      {t.adminSettings.changePassword}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t.systemSettings.title}</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t.systemSettings.maintenance}
                  </label>
                  <p className="text-sm text-gray-500">
                    {lang === 'ko' ? '사이트를 유지보수 모드로 전환합니다.' : 'Switch site to maintenance mode.'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenance}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      maintenance: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.systemSettings.maintenanceMessage} (한국어)
                </label>
                <textarea
                  value={systemSettings.maintenanceMessage.ko}
                  onChange={(e) => setSystemSettings({
                    ...systemSettings,
                    maintenanceMessage: { ...systemSettings.maintenanceMessage, ko: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.systemSettings.maintenanceMessage} (English)
                </label>
                <textarea
                  value={systemSettings.maintenanceMessage.en}
                  onChange={(e) => setSystemSettings({
                    ...systemSettings,
                    maintenanceMessage: { ...systemSettings.maintenanceMessage, en: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t.systemSettings.enableComments}
                  </label>
                  <p className="text-sm text-gray-500">
                    {lang === 'ko' ? '사이트에서 댓글 기능을 활성화합니다.' : 'Enable comments on the site.'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.enableComments}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      enableComments: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSystemSettingsSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t.systemSettings.save}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings; 